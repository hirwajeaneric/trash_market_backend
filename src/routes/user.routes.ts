import express, { NextFunction, Request, Response} from 'express';
import { forgotPassword, regenerateOTP, resetPassword, signIn, signUp, updateAccount, verifyOTP } from '../controller';
import { validateEmail, validateOTP, validatePasswordReset, validateUserSignIn, validateUserSignUp } from '../utils/userValidation';
const userRouter = express.Router();

userRouter.post('/signup', validateUserSignUp, signUp);
userRouter.post('/signin', validateUserSignIn, signIn);
userRouter.post('/verify', validateOTP, verifyOTP);
userRouter.post('/regenerateOtp', regenerateOTP);
userRouter.post('/forgotPassword', validateEmail, forgotPassword);
userRouter.post('/resetPassword', validatePasswordReset, resetPassword);
userRouter.put('/update', updateAccount);


export default userRouter;