import express, { Request, Response, NextFunction } from "express";
import multer from 'multer';
import { addNew, update } from "../controller";
import { validateAddProduct } from "../utils/productValidation";

const productRouter = express.Router();

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString()+'_'+file.originalname);
    }
})

const images = multer({ storage: imageStorage }).array('images', 5);


productRouter.post('/', validateAddProduct, images, addNew);
// productRouter.post('/', images, update);

export default productRouter;