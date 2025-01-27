
import express, { Router } from "express";
import { createTeacher, getTeachers } from "@/controllers/teachers";

const teacherRouter: Router = express.Router();

// Use the router.post/get methods instead of directly passing the controller
teacherRouter.post("/teachers", createTeacher);
teacherRouter.get("/teachers", getTeachers);

export default teacherRouter;
