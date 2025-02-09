
import express, { Router } from "express";
import { createParent, getParents, getParentsBySchoolId } from "@/controllers/parents";

const parentRouter: Router = express.Router();

// Use the router.post/get methods instead of directly passing the controller
parentRouter.post("/parents", createParent);
parentRouter.get("/parents", getParents);
parentRouter.get("/parents/school/:schoolId", getParentsBySchoolId);

export default parentRouter;
