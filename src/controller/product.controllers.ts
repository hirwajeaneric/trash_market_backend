import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../middlewares/AsyncWrapper";
import { Product as ProductModel, ProductDoc } from "../model/product.model";
import { ValidateToken } from "../utils/password.utils";

export const addNew = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, quantity, seller, unitPrice, addressLine1, addressLine2, imageFiles, type, category } = <ProductDoc>req.body;

    if (req.files) {
        const files = req.files as [Express.Multer.File]
        const images = files.map((file: Express.Multer.File) => file.filename);

        
    }

    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    };

    const newProduct = await ProductModel.create({ name, description, quantity, seller, unitPrice, addressLine1, addressLine2, imageFiles, type, category})

    if (newProduct) {
        res.status(200).json({ message: "Product added successfully" });
    }
});



export const update = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
});

