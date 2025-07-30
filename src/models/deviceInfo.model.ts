import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/utils/common/modenName";
import { User } from "./user.model";

@Table({ tableName: ModelName.deviceInfo, timestamps: true })
export class DeviceInfo extends Model<DeviceInfo, Partial<DeviceInfo>> {
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
    declare deviceId: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare deviceToken: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare accessToken: string
    @Column({
        type: DataType.STRING
    })
    declare otp: string
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare otpStatus: boolean

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare userId: string

    @BelongsTo(() => User)
    declare user: User
}