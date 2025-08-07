import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service"
import { RedisService } from "../redis/redis.service";
import { JwtService } from "@nestjs/jwt";
import { FileService } from "../file/file.service";
import { getModelToken } from "@nestjs/sequelize";
import { DeviceInfo, User } from "src/models";
import { OTPVerifyDto, SignupDto } from "src/utils/dto/auth.dto";
import STRINGCONST from "src/utils/common/stringConst";
import * as bcrypt from 'bcryptjs'

describe('AuthService', () => {

    let authService: AuthService
    const mockUserModel = {
        findOne: jest.fn(),
        create: jest.fn()
    }

    const mockDeviceModel = {
        create: jest.fn(),
        findOrCreate: jest.fn(),
        destroy: jest.fn()
    };

    const mockRedisService = {
        set: jest.fn(),
        get: jest.fn()
    };

    const mockJwtService = {
        signAsync: jest.fn()
    };

    const mockFileService = {
        uploadFile: jest.fn()
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: RedisService, useValue: mockRedisService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: FileService, useValue: mockFileService },
                { provide: getModelToken(User), useValue: mockUserModel },
                { provide: getModelToken(DeviceInfo), useValue: mockDeviceModel },
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    it('should send and store otp', async () => {
        mockRedisService.set.mockResolvedValue(undefined);
        const result = await authService.sendOtp('123456789', '+91');
        expect(mockRedisService.set).toHaveBeenCalledWith(`otp:+91-123456789`, expect.any(String));
        expect(result?.status).toBe(200)
    })

    it('should verify otp', async () => {
        const dto: OTPVerifyDto = {
            otp: '123456',
            phoneNo: '123456789',
            countryCode: '+91'
        }
        mockRedisService.get.mockResolvedValue('123456')
        const result = await authService.verifyOTP(dto)
        expect(mockRedisService.get).toHaveBeenCalledWith(`otp:+91-123456789`)
        expect(result?.status).toBe(200)
        expect(result?.message).toBe(STRINGCONST.OTP_VERIFIED)

    })

    it('should throw error if otp wrong or 5 min latter', async () => {
        const dto: OTPVerifyDto = {
            otp: '123456',
            phoneNo: '123456789',
            countryCode: '+91'
        }
        mockRedisService.get.mockResolvedValue(undefined)
        try {
            await authService.verifyOTP(dto)
            fail('Expected SendError to be thrown')
        } catch (error) {
            expect(error.message).toBe(STRINGCONST.INVALID_OTP)
        }
    })

    it('should register new user', async () => {
        const dto: SignupDto = {
            deviceId: 'random-test-device',
            deviceToken: 'random-device-token',
            firstName: 'john',
            lastName: 'doe',
            phoneNo: '123456789',
            countryCode: '+91',
            dob: '1990-01-01',
            email: 'johndoe@iongo.com',
            password: '123456',
            gender: 'male',
            otp: '234567'
        }

        mockUserModel.findOne.mockResolvedValue(null);
        jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('secure-hashed-password'));
        mockUserModel.create.mockResolvedValue({ id: '1', ...dto, dataValues: {} })
        mockJwtService.signAsync.mockResolvedValue('jwt-token')
        mockDeviceModel.create.mockResolvedValue({})

        const result = await authService.signup(dto)

        expect(mockUserModel.findOne).toHaveBeenCalledWith({ where: { email: dto.email } });
        expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 15);
        expect(mockUserModel.create).toHaveBeenCalledWith(expect.objectContaining({
            firstName: dto.firstName,
            email: dto.email,
            password: 'secure-hashed-password'
        }));
        expect(mockJwtService.signAsync).toHaveBeenCalledWith({ userId: '1', email: dto.email })
        expect(mockDeviceModel.create).toHaveBeenCalledWith(expect.objectContaining({
            deviceId: dto.deviceId,
            deviceToken: dto.deviceToken,
            accessToken: 'jwt-token',
            otp: dto.otp,
            otpStatus: true,
            userId: '1'
        }));
        expect(result?.message).toBe(STRINGCONST.ACCOUNT_CREATED)
        expect(result?.data.dataValues.accessToken).toBe('jwt-token')
    })

    it('should thorw error if user exist', async () => {
        const dto: SignupDto = {
            deviceId: 'random-test-device',
            deviceToken: 'random-device-token',
            firstName: 'john',
            lastName: 'doe',
            phoneNo: '123456789',
            countryCode: '+91',
            dob: '1990-01-01',
            email: 'johndoe@iongo.com',
            password: '123456',
            gender: 'male',
            otp: '234567'
        }
        mockUserModel.findOne.mockResolvedValue({ email: 'johndoe@iongo.com' })

        try {
            await authService.signup(dto)
            fail('Expected SendError to be thrown')
        } catch (error) {
            expect(error.message).toBe(STRINGCONST.USRE_EXIST)
        }
    })
})