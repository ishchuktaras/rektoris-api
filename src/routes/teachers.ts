
import express, { Router } from "express";
import { createTeacher, getTeachers, getTeachersBySchoolId } from "@/controllers/teachers";

const teacherRouter: Router = express.Router();

// Use the router.post/get methods instead of directly passing the controller
teacherRouter.post("/teachers", createTeacher);
teacherRouter.get("/teachers", getTeachers);
teacherRouter.get("/teachers/school/:schoolId", getTeachersBySchoolId);

export default teacherRouter;
