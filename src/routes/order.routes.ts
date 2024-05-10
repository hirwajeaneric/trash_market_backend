import express from "express";
import { validateAddOrder } from "../utils/orderValidation";
import { 
    addNew, 
    getClientOrder, 
    getOrderById, 
    getSellerOrders, 
    list, 
    manageOrderProducts, 
    update 
} from "../controller/order.controllers";

const orderRouter = express.Router();

orderRouter.post('/add', validateAddOrder, addNew);
orderRouter.get('/list', list);
orderRouter.put('/update', update);
orderRouter.put('/updateCart', manageOrderProducts);
orderRouter.get('/findById', getOrderById);
orderRouter.get('/client', getClientOrder);
orderRouter.get('/seller', getSellerOrders);

export default orderRouter;