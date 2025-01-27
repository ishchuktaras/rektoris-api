import { createUser, loginUser } from "@/controllers/users";
import express, { Router } from "express";

const userRouter: Router = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
// schoolRouter.get("/customers/:id", getCustomerById);
// schoolRouter.get("/api/v2/customers", getV2Customers);

export default userRouter;
