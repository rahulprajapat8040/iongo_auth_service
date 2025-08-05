import { RequestMethod } from "@nestjs/common";

export const excludeRoutes = [
    { path: '/send-otp', method: RequestMethod.POST },
    { path: '/verify-otp', method: RequestMethod.POST },
    { path: '/signup', method: RequestMethod.POST },
    { path: '/login', method: RequestMethod.POST },
]