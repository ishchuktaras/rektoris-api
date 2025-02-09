import { getDepartments, getBriefDepartments, createDepartment, getDepartmentsBySchoolId } from "@/controllers/departments";
import express, { Router } from "express";

const departmentRouter: Router = express.Router();

departmentRouter.post("/departments", createDepartment);
departmentRouter.get("/departments", getDepartments);
departmentRouter.get("/departments/school/:schoolId", getDepartmentsBySchoolId);
departmentRouter.get("/departments/brief/:schoolId", getBriefDepartments);

// classRouter.get("/customers/:id", getCustomerById);
// classRouter.get("/api/v2/customers", getV2Customers);

export default departmentRouter;
