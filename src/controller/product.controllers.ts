import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../middlewares/AsyncWrapper";
import { Product as ProductModel, ProductDoc } from "../model/product.model";
import { ValidateToken } from "../utils/password.utils";

export const addNew = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    };

    req.body.seller = req.user?._id;

    if (req.files) {
        const files = req.files as [Express.Multer.File]
        const images = files.map((file: Express.Multer.File) => file.filename);
        images.forEach((image) => {
            req.body.imageFiles.push(image);
        });
    }

    console.log(req.body);

    const newProduct = await ProductModel.create(req.body);

    if (newProduct) {
        res.status(200).json({ message: "Product added successfully", product: newProduct });
    };
});



export const list = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {    
    const products = await ProductModel.find({});
    res.status(200).json({ products });
});

export const update = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
});
