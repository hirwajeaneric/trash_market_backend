import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../middlewares/AsyncWrapper";
import { Order as OrderModel, OrderDoc } from "../model/order.model";
import { ValidateToken } from "../utils/password.utils";

export const addNew = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    };

    const newOrder = await OrderModel.create(req.body);

    if (newOrder) {
        res.status(201).json({ message: "Order added successfully", order: newOrder });
    };
});


export const list = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    const orders = await OrderModel.find({});
    res.status(200).json({ orders });
});


export const update = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query; // Assuming order ID comes from the request URL

    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    const orderToUpdate = await OrderModel.findById(id);

    if (!orderToUpdate) {
        return res.status(404).json({ message: "Order not found" });
    }

    // Save the updated order
    const updatedOrder = await OrderModel.findByIdAndUpdate(id, req.body, { new: true });

    if (updatedOrder) {
        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } else {
        res.status(500).json({ message: "Error updating order" });
    }
});

export const manageOrderProducts = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query; // Assuming order ID comes from the request URL
    const { product } = req.body;

    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    const existingOrder = await OrderModel.findById(id);
    const products = existingOrder?.products;

    products?.forEach((productInOrder) => {
        if (productInOrder.id === product.id) {
            productInOrder = product;
        }
    });

    req.body.products = products;

    const updatedOrder = await OrderModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedOrder) {
        return res.status(404).json({ message: "Adding/removing to cart failed, Order not found" });
    }

    if (updatedOrder) {
        res.status(200).json({ message: "Cart updated successfully", order: updatedOrder });
    } else {
        res.status(500).json({ message: "Error adding order to cart" });
    }
});


export const getClientOrder = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Validate token
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    // Get user ID from the request (e.g., from req.user)
    const userId = req.user?._id;

    // Find orders where seller matches the user ID
    const userOrder = await OrderModel.findOne({ client: userId });

    res.status(200).json({ order: userOrder });
});

export const getSellerOrders = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Validate token
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    // Get user ID from the request (e.g., from req.user)
    const userId = req.user?._id;

    // Find orders where seller matches the user ID
    const userOrders = await OrderModel.find({ seller: userId });

    res.status(200).json({ orders: userOrders });
});


export const getOrderById = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query; // Assuming order ID comes from the request URL

    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }
    // Find the order by ID
    const order = await OrderModel.findById(id);

    if (order) {
        res.status(200).json({ order });
    } else {
        res.status(404).json({ message: "Order not found" });
    }
});
