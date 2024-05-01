import express from 'express';
import { signUp } from '../controller';
import { validateUserSignUp } from '../utils/userValidation';
const userRouter = express.Router();

userRouter.post('/signup', validateUserSignUp, signUp);

export default userRouter;