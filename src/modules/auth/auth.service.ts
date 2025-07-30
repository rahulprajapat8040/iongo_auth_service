import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DeviceInfo, User } from "src/models";
import { LoginDto, OTPVerifyDto, SignupDto } from "src/utils/dto/auth.dto";
import { otpGenerator, parameterNotFound, responseSender, SendError } from "src/utils/helper/funcation.helper";
import { RedisService } from "../redis/redis.service";
import STRINGCONST from "src/utils/common/stringConst";
import * as bcrypt from 'bcryptjs'
import { JwtService } from "@nestjs/jwt";
import { FileService } from "../file/file.service";
import { MulterRequest } from "src/types/multer.type";

@Injectable()
export class AuthService {
    constructor(
        private readonly redisService: RedisService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(DeviceInfo) private readonly deviceModel: typeof DeviceInfo
    ) { }

    async sendOtp(phoneNo: string, countryCode: string) {
        try {
            // THROW ERROR IF PHONE NO. OR COUNTRY CODE IS NOT PROVIDED
            if (!phoneNo || !countryCode) {
                SendError("Phone number or country code is missing")
            };

            // GENERATE OTP AND STORE TO REDIS
            const otp = otpGenerator(6)
            this.redisService.set(`otp:${countryCode}-${phoneNo}`, otp)

            // SEND RESPONSE
            return responseSender(STRINGCONST.OTP_SENT, HttpStatus.OK, true, { otp })
        } catch (error) {
            SendError(error.message)
        }
    }

    async verifyOTP(OTPVerifyDto: OTPVerifyDto) {
        try {
            const { otp, phoneNo, countryCode } = OTPVerifyDto;
            const storedOtp = await this.redisService.get(`otp:${countryCode}-${phoneNo}`)
            if (!storedOtp || storedOtp !== otp) {
                SendError(STRINGCONST.INVALID_OTP);
            };
            return responseSender(STRINGCONST.OTP_VERIFIED, HttpStatus.OK, true, null)

        } catch (error) {
            SendError(error.message)
        }
    }

    async signup(signupDto: SignupDto) {
        try {
            const { phoneNo, email, countryCode, otp, password, firstName, lastName, deviceId, deviceToken, dob, gender } = signupDto;
            // THROW ERROR IF EMAIL IS ALREADY TAKEN
            const isExist = await this.userModel.findOne({ where: { email } })
            if (isExist) {
                SendError(STRINGCONST.USRE_EXIST)
            };

            // HASH THE PASSWORD AND CREATE THE USER
            const hashedPass = await bcrypt.hash(password, 15)
            const user = await this.userModel.create({
                firstName, lastName, dob, gender, phoneNo, countryCode, email, password: hashedPass
            })

            // REGISTER JWT TOKEN AND USER DEVICE
            const accessToken = await this.jwtService.signAsync({ userId: user.id, email: user.email })
            await this.deviceModel.create({
                deviceId, deviceToken, accessToken, otp, otpStatus: true, userId: user.id
            });
            (user as any).dataValues.accessToken = accessToken;

            // SEND RESPONSE
            return responseSender(STRINGCONST.ACCOUNT_CREATED, HttpStatus.CREATED, true, user)
        } catch (error) {
            SendError(error.message)
        }
    }

    async login(loginDto: LoginDto) {
        try {
            const { email, password, deviceId, deviceToken } = loginDto
            // FIND THE USER WITH EMAIL, THROW ERROR IF NOT FOUND
            const user = await this.userModel.findOne({ where: { email } })
            if (!user) {
                throw new NotFoundException(STRINGCONST.USER_NOT_FOUND);
            };

            // COMPARE THE PASSWORD AND THROW ERROR IF NOT MATCH
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                SendError(STRINGCONST.INVALID_PASSWORD);
            };

            // GENERATE DEVICE AND ACCESS TOKEN
            const accessToken = await this.jwtService.signAsync({ userId: user.id, email: user.email });
            const [device, created] = await this.deviceModel.findOrCreate({
                where: {
                    deviceId,
                    userId: user.id,
                },
                defaults: {
                    deviceToken,
                    otpStatus: false,
                    accessToken,
                },
            });

            if (!created) {
                // If device already exists, optionally update its accessToken/deviceToken
                await device.update({ accessToken, deviceToken });
            }
            (user as any).dataValues.accessToken = accessToken;

            // SEND RESPONSE
            return responseSender(STRINGCONST.USER_LOGIN, HttpStatus.OK, true, user)
        } catch (error) {
            SendError(error.message);
        }
    };


    async logout(deviceId: string) {
        try {
            parameterNotFound(deviceId, "DeviceId is required in query params")
            // DELETE USER DEVICE AND SNED RESPONSE
            await this.deviceModel.destroy({ where: { deviceId }, force: true });
            return responseSender(STRINGCONST.USER_LOG_OUT, HttpStatus.OK, true, null)
        } catch (error) {
            SendError(error.message)
        }
    };

    async getUserInfo(user: User) {
        try {
            if (!user) {
                SendError(STRINGCONST.USER_NOT_FOUND);
            };
            return responseSender(STRINGCONST.USER_LOGIN, HttpStatus.OK, true, user)
        } catch (error) {
            SendError(error.message)
        }
    }

    async updateUserInfo(req: MulterRequest) {
        const { file, body } = await this.fileService.uploadFile(req, 'profile')
        try {
            const user = req.user as User;
            const res = user.update({ ...body, profilePhoto: file[0] ? file[0].path : body.profilePhoto })
            return responseSender(STRINGCONST.USER_UPDATED, HttpStatus.OK, true, res)
        } catch (error) {
            SendError(error.message)
        }
    }

    // AUTH SERVICE END HERE------
}