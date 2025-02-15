import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import fileHandler from "../service/file-handler";
import CustomerModel from "../model/customer.model";
import uuidGenerator from "../utils/uuidGenrator";
import { IUser } from "../model/user.model";
import ApiFeatures from "../utils/apiFeatuers";

export const addCustomerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUser | undefined = req.user;
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
        res.status(201).json({
            success: true,
            message: "Customer added successfully",
        });
    } catch (err) {
        next(new ErrorHandler(`Server error: ${err}`, 500)); // Pass error to middleware
    }
};

export const allCustomers = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const resultPerPage = Number(query.rowsPerPage) || 10;
    try {
        const apifeature = new ApiFeatures(CustomerModel.find(), query)
        const result = await apifeature.getQuery()
            .populate([
                { path: "user", model: "User" },
                { path: "addhar_card", model: "File" },
                { path: "pan_card", model: "File" },
                { path: "document", model: "File" },
                { path: "profile_image", model: "File" },
            ])
            .sort({ _id: -1 }) 
            .exec();
        res.status(200).json({
            success: true,
            result: result,
            dataCounter:result.length,
            resultPerPage,
        })
    }
    catch (err) {
        next(new ErrorHandler(`Server error: ${err}`, 500)); // Pass error to middleware
    }

}
