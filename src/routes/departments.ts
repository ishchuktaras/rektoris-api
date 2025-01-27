import { getDepartments, getBriefDepartments, createDepartment } from "@/controllers/departments";
import express, { Router } from "express";

const departmentRouter: Router = express.Router();

departmentRouter.post("/departments", createDepartment);
departmentRouter.get("/departments", getDepartments);
departmentRouter.get("/departments/brief", getBriefDepartments);
// classRouter.get("/customers/:id", getCustomerById);
// classRouter.get("/api/v2/customers", getV2Customers);

export default departmentRouter;
