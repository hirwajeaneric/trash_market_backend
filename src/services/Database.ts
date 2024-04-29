import mongoose from "mongoose";

export default async () => {
    mongoose
        .connect(process.env.MONGODB_CONNECTION_STRING as string)
        .then(() => console.log('Connected to database!'));
}