import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { jwtConfig } from "src/configs/jwt.config";
import { DeviceInfo, User } from "src/models";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        SequelizeModule.forFeature([User, DeviceInfo]),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: jwtConfig
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [JwtModule, AuthService]
})

export class AuthModule { }