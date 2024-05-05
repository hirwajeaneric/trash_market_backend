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
        req.body.imageFiles = [];
        const files = req.files as [Express.Multer.File]
        const images = files.map((file: Express.Multer.File) => file.filename);
        images.forEach((image) => {
            req.body.imageFiles.push(image);
        });
    }

    const newProduct = await ProductModel.create(req.body);

    if (newProduct) {
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    };
});



export const list = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const products = await ProductModel.find({});
    res.status(200).json({ products });
});

export const update = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query; // Assuming product ID comes from the request URL

    // Validate token
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    // Find the product to update
    const productToUpdate = await ProductModel.findById(id);
    // Check if product exists
    if (!productToUpdate) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Update product details (if provided in request body)
    const updates = req.body; // Assuming product details are in the request body
    Object.assign(productToUpdate, updates);

    // Handle image updates (if applicable)
    if (req.files) {
        const newImageFiles = (req.files as Express.Multer.File[]).map((file) => file.filename);

        // Check if existing imageFiles property exists
        if (productToUpdate.imageFiles) {
            // Concatenate new images with existing ones
            productToUpdate.imageFiles = productToUpdate.imageFiles.concat(newImageFiles);
        } else {
            // Assign new images if no existing imageFiles property
            productToUpdate.imageFiles = newImageFiles;
        }
    }

    // Save the updated product
    const updatedProduct = await productToUpdate.save();

    if (updatedProduct) {
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } else {
        res.status(500).json({ message: "Error updating product" });
    }
});


export const getUserProducts = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Validate token
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    // Get user ID from the request (e.g., from req.user)
    const userId = req.user?._id;

    // Find products where seller matches the user ID
    const userProducts = await ProductModel.find({ seller: userId });

    res.status(200).json({ products: userProducts });
});


export const getProductById = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query; // Assuming product ID comes from the request URL

    // Find the product by ID
    const product = await ProductModel.findById(id);

    if (product) {
        res.status(200).json({ product });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});


export const getAllAvailableProducts = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Filter products where `client` field is null
    const availableProducts = await ProductModel.find({ client: '' });

    res.status(200).json({ products: availableProducts });
});

export const getBoughtProducts = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Validate token
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    // Get user ID from the request (e.g., from req.user)
    const userId = req.user?._id;

    // Find products where `client` matches the user ID
    const boughtProducts = await ProductModel.find({ client: userId });

    res.status(200).json({ products: boughtProducts });
});

export const deleteProduct = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Validate token (assuming authorization is required for deletion)
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    const { id } = req.query;

    // Find the product to delete
    const productToDelete = await ProductModel.findById(id);

    if (!productToDelete) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product
    await productToDelete.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
});