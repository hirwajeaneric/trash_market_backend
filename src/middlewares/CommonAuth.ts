import { NextFunction, Request, Response } from "express";
import { UserPayload } from "../dto/auth.dto";
import { ValidateToken } from "../utils/password.utils";

declare global {
    namespace Express {
        export interface Request {
            user?: UserPayload;
        }
    }
};

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const validate = await ValidateToken(req);
    if (validate) {
        next();
    } else {
        return res.json({ message: "User not authenticated" })
    }

}