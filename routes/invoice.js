import httpinvoice from "../controllers/invoice.js";


import { check } from "express-validator";
import { Router } from "express";

const router = Router();

router.post("/",[
   
], httpinvoice.postInvoice)

router.get("/",httpinvoice.getInvoice)




export default router;


