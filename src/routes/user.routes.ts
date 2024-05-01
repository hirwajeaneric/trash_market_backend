import express from 'express';
import { forgotPassword, resetPassword, signIn, signUp, verifyOTP } from '../controller';
import { validateEmail, validateOTP, validatePasswordReset, validateUserSignIn, validateUserSignUp } from '../utils/userValidation';
const userRouter = express.Router();

userRouter.post('/signup', validateUserSignUp, signUp);
userRouter.post('/signin', validateUserSignIn, signIn);
userRouter.post('/verify', validateOTP, verifyOTP);
userRouter.post('/forgotPassword', validateEmail, forgotPassword);
userRouter.post('/resetPassword', validatePasswordReset, resetPassword);


export default userRouter;