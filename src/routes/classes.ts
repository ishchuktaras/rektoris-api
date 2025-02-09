import { createClass, getClasses, getBriefClasses, getClassesBySchoolId, createStream, getStreams } from "@/controllers/classes";
import express, { Router } from "express";

const classRouter: Router = express.Router();

classRouter.post("/classes", createClass);
classRouter.get("/classes", getClasses);
classRouter.get("/classes/school/:schoolId", getClassesBySchoolId);
classRouter.get("/classes/brief", getBriefClasses);
classRouter.post("/streams", createStream);
classRouter.get("/streams", getStreams);
// classRouter.get("/customers/:id", getCustomerById);
// classRouter.get("/api/v2/customers", getV2Customers);

export default classRouter;
