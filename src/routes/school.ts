import { createSchool, getSchoolById, getSchools} from "@/controllers/schools";
import { Router } from "express";
import express from "express";

const schoolRouter: Router = express.Router();

schoolRouter.post("/schools", createSchool);
schoolRouter.get("/schools", getSchools);
schoolRouter.get("/schools/:id", getSchoolById);
// schoolRouter.get("/api/v2/customers", getV2Customers);

export default schoolRouter;
