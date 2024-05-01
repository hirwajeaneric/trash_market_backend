import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../middlewares/AsyncWrapper";
import UserModel from "../model/user.model";
import { GeneratePassword, GenerateSalt, GenerateToken, ValidatePassword, ValidateToken } from "../utils/password.utils";
import { GenerateOTP, sendEmail } from "../utils/notification.utils";
import { Token } from "../model/token.model";

export const signUp = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
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
    res.status(200).json({ message: "Account created!" });
});



export const signIn = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Check existing email
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (!existingUser) {
        return res.status(400).json({ message: "Invalid email or password" });
    };

    // Check password
    const isPasswordValid = await ValidatePassword(req.body.password, existingUser.password, existingUser.salt);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    };

    if (!existingUser.verified) {
        return res.status(400).json({ message: "Please verify your account first" });
    }

    const token = await GenerateToken({
        _id: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified
    });

    const { password: hashedPassword, ...rest } = existingUser._doc;

    // Send response
    res
        .cookie("access-token", token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
        .status(200)
        .json({ user: rest, token });
});



export const verifyOTP = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const foundUser = await UserModel.findOne({ otp: req.body.otp });
    if (!foundUser) {
        return res.status(400).json({ message: "Invalid OTP" });
    };

    if (new Date(foundUser.otpExpiryTime).getTime() < new Date().getTime()) {
        return res.status(400).json({ message: "OTP expired" });
    };

    foundUser.verified = true;
    const savedUser = await foundUser.save();

    if (savedUser) {
        return res.status(200).json({ message: "User account verified!" });
    }
});



export const forgotPassword = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const foundUser = await UserModel.findOne({ email: req.body.email });
    if (!foundUser) {
        return res.status(400).json({ message: "Account with this email is not registered!" });
    };

    const token = await GenerateToken({
        _id: foundUser._id,
        email: foundUser.email,
        verified: foundUser.verified
    });

    await Token.create({
        token,
        user: foundUser._id,
        expirationDate: new Date().getTime() + (60 * 1000 * 5),
    });

    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}&id=${foundUser._id}`
    const emailBody = `Click on the link bellow to reset your password.\n\n${link}`;

    await sendEmail(foundUser.email, "Reset your password", emailBody);

    res.status(200).json({ message: "We sent you a reset password link on your email!" });
});



export const resetPassword = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Invalid token" });
    };

    const foundUser = await UserModel.findById(req.user?._id);
    if (!foundUser) {
        return res.status(400).json({ message: "Invalid token" });
    };

    foundUser.password = await GeneratePassword(req.body.password, foundUser.salt);

    await foundUser.save()
    await Token.deleteOne({ user: req.user?._id });

    res.status(200).json({ message: "Your password has been reset!" });
});