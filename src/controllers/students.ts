
import { db } from "@/db/db";
import {StudentCreateProps, TypedRequestBody } from "@/types/types";
import { Request, Response } from "express";

export const createStudent = async (req: TypedRequestBody<StudentCreateProps>, res: Response): Promise<void> => {
  const data = req.body;
  const { birthCertificateNumber, regNo, email, rollNumber, dateOfBirth, admissionDate } = data;
  
  try {
    // Validate dates
    const parsedDateOfBirth = new Date(dateOfBirth);
    const parsedAdmissionDate = new Date(admissionDate);
    
    if (isNaN(parsedDateOfBirth.getTime())) {
      res.status(400).json({ error: "Invalid date of birth format" });
      return;
    }
    
    if (isNaN(parsedAdmissionDate.getTime())) {
      res.status(400).json({ error: "Invalid admission date format" });
      return;
    }

    // Check for existing entries
    const existingEntries = await Promise.all([
      db.student.findUnique({ where: { email } }),
      db.student.findUnique({ where: { birthCertificateNumber } }),
      db.student.findUnique({ where: { regNo } }),
      db.student.findUnique({ where: { rollNumber } })
    ]);

    const [existingEmail, existingBirthCertificateNumber, existingRegNo, existingRollNumber] = existingEntries;

    if (existingEmail) {
      res.status(409).json({ error: "Student with this Email already exists" });
      return;
    }
    if (existingBirthCertificateNumber) {
      res.status(409).json({ error: "Student with this Birth Certificate Number already exists" });
      return;
    }
    if (existingRegNo) {
      res.status(409).json({ error: "Student with this Registration Number already exists" });
      return;
    }
    if (existingRollNumber) {
      res.status(409).json({ error: "Student with this School Number already exists" });
      return;
    }

    // Create student with validated dates
    const newStudent = await db.student.create({
      data: {
        ...data,
        dateOfBirth: parsedDateOfBirth,
        admissionDate: parsedAdmissionDate
      }
    });

    res.status(201).json({
      data: newStudent,
      error: null
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({
      data: null,
      error: "Failed to create student. Please try again later."
    });
  }
};


export const getStudents = async(req: Request, res: Response): Promise<void> =>
{
  try {
    const students = await db.student.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(students);
    return
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Something went wrong"
    });
    res.status(500).json({
      data: null,
      error: "Failed to get next student sequence. Please try again later."
    });
  }
}

export const getNextStudentSequence = async (req: Request, res: Response): Promise<void> => {

  try {

    const sequence = await db.student.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
    // "ZS/PS/2025/001"
    const lastStudent = await db.student.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
    const stringSequence = lastStudent?.regNo.split("/")[3];
    const lastSequence = stringSequence ? parseInt(stringSequence) : 0;
    const nextSequence = lastSequence + 1;
    res.status(200).json(nextSequence);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Failed to get next student sequence. Please try again later."
    });
  }
}

