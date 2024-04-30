import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../middlewares/AsyncWrapper";
import { UserLoginInput } from "../dto/auth.dto";
import UserModel from "../model/user.model";
import { GeneratePassword, GenerateSalt } from "../utils/password.utils";
import { GenerateOTP, sendEmail } from "../utils/notification.utils";

const signUp = asyncWrapper(async(req: Request, res: Response, next: NextFunction) => {
    // Check existing email
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    };
    const salt = await GenerateSalt();
    req.body.password = await GeneratePassword(req.body.password, salt);
    
    // Create OTP
    const { otp, expiryDate } = GenerateOTP();
    req.body.otp = otp;
    req.body.salt = salt;
    req.body.otpExpiryTime = expiryDate;

    // Record account
    const recordedUser = await UserModel.create(req.body);

    // Send email
    if (recordedUser) {
        await sendEmail(req.body.email, "Verify your account", `Your OTP is ${otp}`);
    }
    // Send response
    res.status(200).json({ message: recordedUser });
});