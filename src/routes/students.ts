
import express, { Router } from "express";
import { createStudent, getStudents, getNextStudentSequence, getStudentsBySchoolId, getStudentsByParentId } from "@/controllers/students";

const studentRouter: Router = express.Router();

// Use the router.post/get methods instead of directly passing the controller
studentRouter.post("/students", createStudent);
studentRouter.get("/students", getStudents);
studentRouter.get("/students/school/:schoolId", getStudentsBySchoolId);
studentRouter.get("/students/parent/:parentId", getStudentsByParentId);
studentRouter.get("/students/sequence/:schoolId", getNextStudentSequence);

export default studentRouter;
