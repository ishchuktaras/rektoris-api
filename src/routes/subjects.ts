import { createSubject, getSubjects, getBriefSubjects, getSubjectsBySchoolId } from "@/controllers/subjects";
import express, { Router } from "express";

const subjectRouter: Router = express.Router();

subjectRouter.post("/subjects", createSubject);
subjectRouter.get("/subjects", getSubjects);
subjectRouter.get("/subjects/school/:schoolId", getSubjectsBySchoolId);
subjectRouter.get("/subjects/brief/:schoolId", getBriefSubjects);
// classRouter.get("/customers/:id", getCustomerById);
// classRouter.get("/api/v2/customers", getV2Customers);

export default subjectRouter;
