import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import ErrorHandlerMiddleware from '../middlewares/ErrorHandler';
import userRouter from '../routes/user.routes';
import bodyParser, { json } from 'body-parser';
import path from 'path';
import productRouter from '../routes/product.routes';

export default async (app: Application) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    // app.use(express.json());
    app.use('/images', express.static(path.join(__dirname, 'images')));
    
    app.use(cors({
        origin: [process.env.CLIENT_URL as string],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }));

    app.get("/health", async(req: Request, res: Response ) => {
        res.send({
            message: "Health OK!"
        });
    });

    app.use('/api/v1/auth', userRouter);
    app.use('/api/v1/product', productRouter);

    app.use(ErrorHandlerMiddleware);

    return app;
}