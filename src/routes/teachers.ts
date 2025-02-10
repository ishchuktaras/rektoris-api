
import express, { Router } from "express";
import { createTeacher, getTeachers, getTeachersBySchoolId } from "@/controllers/teachers";

const teacherRouter: Router = express.Router();

teacherRouter.post("/teachers", createTeacher);
teacherRouter.get("/teachers", getTeachers);
teacherRouter.get("/teachers/school/:schoolId", getTeachersBySchoolId);

export default teacherRouter;
