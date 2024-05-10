import express from "express";
import { validateAddOrder } from "../utils/orderValidation";
import { 
    addNew, 
    getClientOrders, 
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
orderRouter.get('/updateOrder', manageOrderProducts);
orderRouter.get('/findById', getOrderById);
orderRouter.get('/clientOrders', getClientOrders);
orderRouter.get('/sellerOrders', getSellerOrders);

export default orderRouter;