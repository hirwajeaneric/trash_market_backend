import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import ErrorHandlerMiddleware from '../middlewares/ErrorHandler';
import userRouter from '../routes/user.routes';

export default async (app: Application) => {
    app.use(express.json());
    app.use(cors());

    app.get("/health", async(req: Request, res: Response ) => {
        res.send({
            message: "Health OK!"
        });
    });

    app.use('/api/v1/auth', userRouter);
    // app.use('/api/v1/user', userRouter);
    // app.use('/api/v1/product', userRouter);

    app.use(ErrorHandlerMiddleware);

    return app;
}