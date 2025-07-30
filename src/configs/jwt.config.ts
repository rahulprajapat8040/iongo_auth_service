import { ConfigService } from "@nestjs/config";

export const jwtConfig = (configService: ConfigService) => ({
    secret: configService.get<string>("JWT_ACCESS_TOKEN_KEY") || "fallback-secret",
    signOption: { expiresIn: '15d' }
})