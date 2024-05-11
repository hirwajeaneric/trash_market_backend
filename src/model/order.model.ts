import { model, Document, Schema } from "mongoose";

type DeliveryStatus = {
    client: "Pending" | "Recieved";
    seller: "Pending" | "Delivered";
}

export type ProductTypes = {
    id: Schema.Types.ObjectId;
    name: string;
    quantity: number;
    maxQuantity: number;
    pricePerUnit: number;
}

export interface OrderDoc extends Document {
    client: Schema.Types.ObjectId;
    seller: Schema.Types.ObjectId;
    deliveryPrice: Number;
    products: ProductTypes[];
    totalPrice: Number;
    paid: boolean;
    status: ['Pending' | 'In Progress' | 'Completed'];
    deliveryStatus: DeliveryStatus;
};

const OrderSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deliveryPrice: {
        type: Number,
        required: true,
    },
    products: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref: 'Order',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            maxQuantity: {
                type: Number,
                required: true
            },
            pricePerUnit: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    paid: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    deliveryStatus: {
        client: {
            type: String,
            required: true,
            enum: {
                values: ['Pending', 'Recieved'],
                message: "Invalid delivery status"
            },
            default: 'Pending'
        },
        seller: {
            type: String,
            required: true,
            enum: {
                values: ['Pending', 'Delivered'],
                message: "Invalid delivery status"
            },
            default: 'Pending'
        }
    }
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret.__v;
        }
    },
    timestamps: true
});

export const Order = model<OrderDoc>("Order", OrderSchema);