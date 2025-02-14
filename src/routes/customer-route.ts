import { Router } from "express";
import { addCustomerController } from "../controller/customer-contoller";
import upload from "../middlewares/multer";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/authMiddleware";
const router = Router();

router.post('/add-customer',isAuthenticatedUser,authorizeRoles("userrrrr"), upload.fields([
    { name: "addharCard", maxCount: 5 },
    { name: "panCard", maxCount: 5 },
    { name: "document", maxCount: 5 },
    { name: "profileImage", maxCount: 1 }
]), addCustomerController)

export default router;