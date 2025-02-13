import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";

export const isAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers.authorization;
    if (!token) {
        return next(new ErrorHandler("Please log in first", 400));
    }
    try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        //     id: string;
        // };

        // const user = await User.findById(decoded.id);
        // if (!user) {
        //     return next(new ErrorHandler("User not found", 404));
        // }

        // (req as any).user = user;
        next();
    }
    catch (error) {
        // if (error instanceof jwt.TokenExpiredError) {
        //     return next(new ErrorHandler("Token expired. Please log in again.", 401));
        // } else {
        return next(new ErrorHandler(`Invalid token. Please log in again. ${error}`, 401));
        // }
    }
}
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(roles)
        // if (!req.user || !roles.includes(req.user.role)) {
        //     return next(
        //       new ErrorHandler(
        //         `Role: ${req.user?.role} is not allowed to access this resource`,
        //         403
        //       )
        //     );
        //   }

        next();
    }
}