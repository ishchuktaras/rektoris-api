import { getAnalyticsBySchoolId } from "@/controllers/analytics";
import express from "express";

const analyticsRouter = express.Router();

analyticsRouter.get("/analytics/school/:schoolId", getAnalyticsBySchoolId);

// analyticsRouter.post("/contacts", createContact);
// schoolRouter.get("/customers/:id", getCustomerById);
// schoolRouter.get("/api/v2/customers", getV2Customers);

export default analyticsRouter;
