import { createContact, getContacts } from "@/controllers/admin";
import express, { Router } from "express";

const adminRouter: Router = express.Router();

adminRouter.post("/contacts", createContact);
adminRouter.get("/contacts", getContacts);
// schoolRouter.get("/customers/:id", getCustomerById);
// schoolRouter.get("/api/v2/customers", getV2Customers);

export default adminRouter;
