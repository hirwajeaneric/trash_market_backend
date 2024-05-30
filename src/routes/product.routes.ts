import express from "express";
import multer from 'multer';
import { addNew, deleteProduct, getAllAvailableProducts, getBoughtProducts, getProductById, getUserProducts, list, update } from "../controller/product.controllers";
import { validateAddProduct } from "../utils/productValidation";

const productRouter = express.Router();

productRouter.post('/add', addNew);
productRouter.get('/list', list);
productRouter.put('/update', update);
productRouter.get('/user', getUserProducts);
productRouter.get('/findById', getProductById);
productRouter.get('/available', getAllAvailableProducts);
productRouter.get('/baught', getBoughtProducts);
productRouter.delete('/delete', deleteProduct);

export default productRouter;