import { Body, Controller, Post } from "@nestjs/common";
import { userService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: userService
    ) { }

    @Post("get-users-by-ids")
    async getUsersByIds(
        @Body('userIds') userIds: string[]
    ) {
        return this.userService.getUserByIds(userIds)
    }
}