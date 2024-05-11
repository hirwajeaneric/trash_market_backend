import express from "express";
import { 
    addNew, 
    getClientOrder, 
    getOrderById, 
    getSellerOrders, 
    list, 
    manageOrderProducts, 
    update,
    testRequest
} from "../controller/order.controllers";

const orderRouter = express.Router();

orderRouter.post('/add', addNew);
orderRouter.get('/list', list);
orderRouter.put('/update', update);
orderRouter.put('/updateCart', manageOrderProducts);
orderRouter.get('/findById', getOrderById);
orderRouter.get('/client', getClientOrder);
orderRouter.get('/seller', getSellerOrders);

export default orderRouter;