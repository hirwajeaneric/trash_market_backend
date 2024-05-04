import express, { Request, Response, NextFunction } from "express";
import multer from 'multer';
import { addNew, list, update } from "../controller";
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

const testMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    next();
};


productRouter.post('/add', testMiddleware, validateAddProduct, images, addNew);
productRouter.get('/list', list);
productRouter.put('/update', images, update);

export default productRouter;