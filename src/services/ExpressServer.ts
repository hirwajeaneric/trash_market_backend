import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import ErrorHandlerMiddleware from '../middlewares/ErrorHandler';

export default async (app: Application) => {
    app.use(express.json());
    app.use(cors());

    app.get("/health", async(req: Request, res: Response ) => {
        res.send({
            message: "Health OK!"
        });
    });

    app.use(ErrorHandlerMiddleware);

    return app;
}