import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { User } from "src/models";
import STRINGCONST from "src/utils/common/stringConst";
import { responseSender, SendError } from "src/utils/helper/funcation.helper";


@Injectable()
export class userService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User
    ) { }

    async getUserByIds(userIds: string[]) {
        try {
            const res = await this.userModel.findAll({ where: { id: { [Op.in]: userIds } } })
            return responseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, res);
        } catch (error) {
            SendError(error.message)
        }
    }
}