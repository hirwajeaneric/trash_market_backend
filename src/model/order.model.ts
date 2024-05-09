import { model, Document, Schema } from "mongoose";

type DeliveryStatus = {
    client: "Pending" | "Recieved",
    seller: "Pending" | "Delivered",
}

export interface OrderDoc extends Document {
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        }
    ];
    paid: boolean;
    status: ['Pending' | 'In Progress' | 'Completed'];
    deliveryStatus: DeliveryStatus;
};

const OrderSchema = new Schema({
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        }
    ],
    paid: { type: Boolean, required: true, default: false },
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
},{
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret.__v;
        }
    },
    timestamps: true
});

export const Order = model<OrderDoc>("Order", OrderSchema);