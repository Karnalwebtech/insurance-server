import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import fileHandler from "../service/file-handler";
import CustomerModel from "../model/customer.model";
import uuidGenerator from "../utils/uuidGenrator";
import { IUser } from "../model/user.model";

export const addCustomerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUser | undefined = req.user;
    const t = false
    if(!t){
        return next(new ErrorHandler("Test error", 404))
    }
        if (!user) {
            return next(new ErrorHandler("User not found", 404))
        }
        const filedata = await fileHandler(req, next)
        if (!filedata || typeof filedata !== "object") {
            return next(new ErrorHandler("File upload failed.", 400));
        }
        const { fullname, policy_no, phone, dop, dor, issue_policy_year, si, amount, email, category, healthConditions } = req.body;
        const counter = await CustomerModel.countDocuments();
        const customer = await CustomerModel.create({
            no: counter + 1,
            id: `cust_${uuidGenerator()}_${counter}`,
            addhar_card: filedata.addharCard,
            pan_card: filedata.addharCard,
            document: filedata.addharCard,
            profile_image: filedata.addharCard,
            user: user._id,
            fullname, policy_no, phone, dop, dor, issue_policy_year, si, amount, email, category, health_conditions: healthConditions
        })
        res.status(200).json({
            success: true,
            message: "Customer added successfully",
        });
    } catch (err) {
        next(new ErrorHandler(`Server error: ${err}`, 500)); // Pass error to middleware
    }
};
