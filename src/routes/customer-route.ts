import { addCustomerController } from "@/controller/customer-contoller";
import {Router} from "express";
const router = Router();

router.post('/',addCustomerController)

export default router;