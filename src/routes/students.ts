
import express, { Router } from "express";
import { createStudent, getStudents, getNextStudentSequence } from "@/controllers/students";

const studentRouter: Router = express.Router();

// Use the router.post/get methods instead of directly passing the controller
studentRouter.post("/students", createStudent);
studentRouter.get("/students", getStudents);
studentRouter.get("/students/sequence", getNextStudentSequence);

export default studentRouter;
