import {Router} from "express";
import { addCustomerController } from "../controller/customer-contoller";
import upload from "../middlewares/multer";
const router = Router();

router.post('/add-customer', upload.array("images", 10),addCustomerController)

export default router;