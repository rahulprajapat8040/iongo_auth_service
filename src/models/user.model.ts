import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/utils/common/modenName";
import { DeviceInfo } from "./deviceInfo.model";

@Table({ tableName: ModelName.user, paranoid: true })
export class User extends Model<User, Partial<User>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare firstName: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare lastName: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare email: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string
    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    declare dob: string
    @Column({
        type: DataType.ENUM("male", "female", "other"),
        allowNull: false
    })
    declare gender: "male" | "female" | "other"
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare phoneNo: string
    @Column({
        type: DataType.STRING
    })
    declare countryCode: string
    @Column({
        type: DataType.STRING
    })
    declare profilePhoto: string

    @HasMany(() => DeviceInfo)
    declare devices: DeviceInfo[]
}