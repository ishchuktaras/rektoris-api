import { db } from "@/db/db";
import { StudentCreateProps, TypedRequestBody } from "@/types/types";
import { Request, Response } from "express";
import { createUserService } from "./users";
import { UserRole } from "@prisma/client";

export const createStudent = async (
  req: TypedRequestBody<StudentCreateProps>,
  res: Response
): Promise<void> => {
  const data = req.body;
  const {
    birthCertificateNumber,
    regNo,
    email,
    rollNumber,
    dateOfBirth,
    admissionDate,
  } = data;

  try {
    // Validate dates
    const parsedDateOfBirth = new Date(dateOfBirth);
    const parsedAdmissionDate = new Date(admissionDate);

    if (isNaN(parsedDateOfBirth.getTime())) {
      res.status(400).json({ error: "Neplatný formát data narození" });
      return;
    }

    if (isNaN(parsedAdmissionDate.getTime())) {
      res.status(400).json({ error: "Neplatný formát data přijetí" });
      return;
    }

    // Check for existing entries
    const existingEntries = await Promise.all([
      db.student.findUnique({ where: { email } }),
      db.student.findUnique({ where: { birthCertificateNumber } }),
      db.student.findUnique({ where: { regNo } }),
      db.student.findUnique({ where: { rollNumber } }),
    ]);

    const [
      existingEmail,
      existingBirthCertificateNumber,
      existingRegNo,
      existingRollNumber,
    ] = existingEntries;

    if (existingEmail) {
      res.status(409).json({ error: "Student s tímto e-mailem již existuje" });
      return;
    }
    if (existingBirthCertificateNumber) {
      res
        .status(409)
        .json({ error: "Student s tímto rodným číslem již existuje" });
      return;
    }
    if (existingRegNo) {
      res
        .status(409)
        .json({ error: "Student s tímto registračním číslem již existuje" });
      return;
    }
    if (existingRollNumber) {
      res
        .status(409)
        .json({ error: "Student s tímto školním číslem již existuje" });
      return;
    }

    // Create a student as a user
    const userData = {
      email: data.email,
      password: data.password,
      role: "STUDENT" as UserRole,
      name: data.name,
      phone: data.phone,
      image: data.imageUrl,
      schoolId: data.schoolId,
      schoolName: data.schoolName,
    };
    const user = await createUserService(userData);
    data.userId = user.id;
    // Create student with validated dates
    const newStudent = await db.student.create({
      data: {
        ...data,
        dateOfBirth: parsedDateOfBirth,
        admissionDate: parsedAdmissionDate,
      },
    });

    res.status(201).json({
      data: newStudent,
      error: null,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({
      data: null,
      error: "Vytvoření studenta se nezdařilo. ",
    });
  }
};

export const getStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const students = await db.student.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(students);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Něco se pokazilo",
    });
    res.status(500).json({
      data: null,
      error: "Nepodařilo se získat další sekvenci studentů.",
    });
  }
};

export const getStudentsBySchoolId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { schoolId } = req.params;
    const students = await db.student.findMany({
      where: {
        schoolId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(students);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Něco se pokazilo",
    });
    res.status(500).json({
      data: null,
      error: "Nepodařilo se získat další sekvenci studentů.",
    });
  }
};

export const getNextStudentSequence = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { schoolId } = req.params;
    const sequence = await db.student.findFirst({
      where:{
        schoolId
      },
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
      error: "Nepodařilo se získat další sekvenci studentů.",
    });
  }
};
