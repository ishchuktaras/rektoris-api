
import express, { Router } from "express";
import { createParent, getParents } from "@/controllers/parents";

const parentRouter: Router = express.Router();

// Use the router.post/get methods instead of directly passing the controller
parentRouter.post("/parents", createParent);
parentRouter.get("/parents", getParents);

export default parentRouter;
