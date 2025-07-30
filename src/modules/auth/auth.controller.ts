import { Body, Controller, Get, Post, Put, Query, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, OTPVerifyDto, SignupDto } from "src/utils/dto/auth.dto";
import { Request } from "express";
import { User } from "src/models";
import { MulterRequest } from "src/types/multer.type";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post("send-otp")
    async sendOtp(
        @Body('phoneNo') phoneNo: string,
        @Body('countryCode') countryCode: string
    ) {
        return this.authService.sendOtp(phoneNo, countryCode);
    };

    @Post('verify-otp')
    async verifyOTP(
        @Body() OTPVerifyDto: OTPVerifyDto
    ) {
        return this.authService.verifyOTP(OTPVerifyDto);
    };

    @Post("signup")
    async signup(
        @Body() signupDto: SignupDto
    ) {
        return this.authService.signup(signupDto);
    }

    @Post("login")
    async login(
        @Body() loginDto: LoginDto
    ) {
        return this.authService.login(loginDto);
    }

    @Get("logout")
    async logout(
        @Query('deviceId') deviceId: string
    ) {
        return this.authService.logout(deviceId)
    };

    @Get('get-user-info')
    async getUserInfo(
        @Req() req: Request
    ) {
        return this.authService.getUserInfo(req.user as User)
    }

    @Put("update-user-info")
    async updateUserInfo(
        @Req() req: MulterRequest
    ) {
        return this.authService.updateUserInfo(req)
    }

}