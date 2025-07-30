import { DatabaseModule } from "./database/database.module";
import { RedisModule } from "./redis/redis.module";
import { AuthModule } from "./auth/auth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/models";
import { FileModule } from "./file/file.module";

const Modules = [SequelizeModule.forFeature([User]), DatabaseModule, RedisModule, AuthModule, FileModule]

export default Modules;