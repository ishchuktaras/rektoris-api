import { db } from "@/db/db";
import { TypedRequestBody, TeacherCreateProps } from "@/types/types";
import { convertDateToIso } from "@/utils/convertDateToIso";
import { Request, Response } from "express";

export const createTeacher = async (
  req: TypedRequestBody<TeacherCreateProps>,
  res: Response
): Promise<void> => {
  const data = req.body;
  console.log(data);
  const { nationalId, phone, email, dateOfBirth, dateOfJoining } = data;
  data.dateOfBirth = convertDateToIso(dateOfBirth);
  data.dateOfJoining = convertDateToIso(dateOfJoining);
  
  try {
    // Check for existing entries
    const [existingEmail, existingNationalId, existingPhoneNumber] =
      await Promise.all([
        db.teacher.findUnique({ where: { email } }),
        db.teacher.findUnique({ where: { nationalId } }),
        db.teacher.findUnique({ where: { phone } }),
      ]);

    if (existingNationalId) {
      res
        .status(409)
        .json({ error: "Učitel s tímto čislem občanského průkazu již existuje" });
      return;
    }
    if (existingEmail) {
      res.status(409).json({ error: "Učitel s tímto e-mailem již existuje" });
      return;
    }
    if (existingPhoneNumber) {
      res.status(409).json({ error: "Učitel s tímto telefonem již existuje" });
      return;
    }

    // Create a new parent
    const newTeacher = await db.teacher.create({
      data,
    });
    console.log(
      `Učitel úspěšně vytvořil: ${newTeacher.firstName} (${newTeacher.id})`
    );
    res.status(201).json({ data: newTeacher });
  } catch (error: any) {
    console.error("Chyba databáze:", error); // Add more logging here
    res.status(500).json({ error: "Chyba databáze: " + error.message });
  }
};

export const getTeachers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teachers = await db.teacher.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(teachers);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Něco se pokazilo",
    });
  }
};
