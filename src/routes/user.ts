import { createUser, getAllUsers, getUserProfileId, loginUser } from "@/controllers/users";
import express, { Router } from "express";

const userRouter: Router = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/users", getAllUsers);
userRouter.get("/users/:userId", getUserProfileId);

// schoolRouter.get("/api/v2/customers", getV2Customers);

export default userRouter;
