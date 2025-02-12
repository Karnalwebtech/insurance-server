import ErrorHandler from "@/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

export const addCustomerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
        res.status(200).json({
            success: true,
            message: "Customer added successfully",
        });
    } catch (err) {
        next(new ErrorHandler(`Server error: ${err}`, 500)); // Pass error to middleware
    }
};
