import { IsDate, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class OTPVerifyDto {
    @IsNotEmpty({ message: "Phone number is required" })
    @IsString({ message: "Phone must be a string" })
    phoneNo: string
    @IsNotEmpty({ message: "Country Code is required" })
    @IsString({ message: "Country Code must be a string" })
    countryCode: string
    @IsNotEmpty({ message: "OTP is required" })
    @IsString({ message: "OTP must be a string" })
    otp: string
}

export class SignupDto {
    // DEVICE ID ---
    @IsNotEmpty({ message: "DeviceId is required" })
    @IsString({ message: "DeviceId must be a string" })
    deviceId: string

    // DEVICE FMC OR OTHER TOKEN ---
    @IsNotEmpty({ message: "DeviceToken is required" })
    @IsString({ message: "DeviceToken must be a string" })
    deviceToken: string

    // USER FIRST NAME ----
    @IsNotEmpty({ message: "First Name is required" })
    @IsString({ message: "First Name must be a string" })
    firstName: string

    // USER LAST NAME -----
    @IsNotEmpty({ message: "Last Name is required" })
    @IsString({ message: "Last Name must be a string" })
    lastName: string

    // USER PHONE NO. -----
    @IsNotEmpty({ message: "Phone number is required" })
    @IsString({ message: "Phone number must be a string" })
    phoneNo: string

    // USER PHONE NO. COUNTRY CODE -----
    // USER PHONE NO. -----
    @IsNotEmpty({ message: "Country Code is required" })
    @IsString({ message: "Country Code must be a string" })
    countryCode: string

    // USER DOB ----
    @IsNotEmpty({ message: "DOB is required" })
    dob: string

    // USER EMAIL ----
    @IsNotEmpty({ message: "Email is required" })
    @IsString({ message: "Email must be a date" })
    email: string

    // USER PASSWORD -----
    @IsNotEmpty({ message: "Email is required" })
    @IsString({ message: "Email must be a date" })
    password: string

    // USER GENDER -----
    @IsNotEmpty({ message: 'Gender is required' })
    @IsString({ message: 'Gender must be a string' })
    @IsIn(['male', 'female', 'other'], { message: 'Gender must be either male, female, or other' })
    gender: 'male' | 'female' | 'other';

    // OTP FOR PHONE NO.. 
    @IsOptional()
    @IsString({ message: 'Otp must be a string' })
    otp?: string
}

export class LoginDto {
    // DEVICE ID ---
    @IsNotEmpty({ message: "DeviceId is required" })
    @IsString({ message: "DeviceId must be a string" })
    deviceId: string

    // DEVICE FMC OR OTHER TOKEN ---
    @IsNotEmpty({ message: "DeviceToken is required" })
    @IsString({ message: "DeviceToken must be a string" })
    deviceToken: string

    // USER EMAIL ----
    @IsNotEmpty({ message: "Email is required" })
    @IsString({ message: "Email must be a date" })
    email: string

    // USER PASSWORD -----
    @IsNotEmpty({ message: "Email is required" })
    @IsString({ message: "Email must be a date" })
    password: string
}