import {Request,Response} from "express";
import ErrorHandler from "../utils/errorHandler";

const errorMiddleware =(err:ErrorHandler,req:Request,res:Response)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error"
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 404);
    }
      // MongoDB duplicate key errors
      if (err.code === 11000 && err.keyValue) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
      }
      // Wrong JWT error
      if (err.name === 'JsonWebTokenError') {
        const message = `Token invalid, try again`;
        err = new ErrorHandler(message, 400);
    }

    // JWT expire error
    if (err.name === 'TokenExpiredError') {
        const message = `Token expired, try again`;
        err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        error: err.stack,
        message: err.message,
    });
}
export default errorMiddleware;