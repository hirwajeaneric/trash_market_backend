import express, { Request, Response, NextFunction } from "express";
import multer from 'multer';
import { addNew, list, update } from "../controller";
import { validateAddProduct } from "../utils/productValidation";

const productRouter = express.Router();

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '_' + file.originalname);
        console.log(req.files);
    }
});

const images = multer({ storage: imageStorage }).array('imageFiles', 5);

productRouter.post('/add',images, validateAddProduct, addNew);
productRouter.get('/list', list);
productRouter.put('/update', images, update);

export default productRouter;