import express from "express";
import { 
    addNew, 
    getClientOrder, 
    getOrderById, 
    getSellerOrders, 
    list, 
    manageOrderProducts, 
    update,
    // testRequest,
    deleteOrder,
    getAllClientOrders,
    updateOrderStatus,
    markOrderAsDelivered
} from "../controller/order.controllers";

const orderRouter = express.Router();

orderRouter.post('/add', addNew);
orderRouter.get('/list', list);
orderRouter.put('/update', update);
orderRouter.put('/updateCart', manageOrderProducts);
orderRouter.get('/updateCartStatus', updateOrderStatus);
orderRouter.get('/markOrderAsDelivered', markOrderAsDelivered);
orderRouter.get('/findById', getOrderById);
orderRouter.get('/client', getClientOrder);
orderRouter.get('/purchases', getAllClientOrders);
orderRouter.get('/seller', getSellerOrders);
orderRouter.delete('/delete', deleteOrder);

export default orderRouter;