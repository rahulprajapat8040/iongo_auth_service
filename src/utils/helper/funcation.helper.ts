import { BadRequestException, NotFoundException } from "@nestjs/common"

export const SendError = (message: string) => {
    throw new BadRequestException(message)
}

export const otpGenerator = (size: number) => {
    const value = Math.pow(10, size - 1);
    const otp = Math.floor(value + Math.random() * (9 * value));
    return String(otp)
};

export const responseSender = (message: string, status: number, success: boolean, data: any) => {
    return {
        message, status, success, data
    }
}

export const parameterNotFound = (key: string, message: string) => {
    if (!key) {
        throw new NotFoundException(message);
    }
}