import { db } from "@/db/db";
import { TypedRequestBody, TeacherCreateProps } from "@/types/types";
import { convertDateToIso } from "@/utils/convertDateToIso";
import { UserRole } from "@prisma/client";
import { Request, Response } from "express";
import { createUserService } from "./users";

export async function createTeacher(
  req: TypedRequestBody<TeacherCreateProps>,
  res: Response
) {
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
      res.status(409).json({
        error: "Učitel s tímto čislem občanského průkazu již existuje",
      });
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

    // Create a teacher as a user
    const userData = {
      email: data.email,
      password: data.password,
      role: "TEACHER" as UserRole,
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      image: data.imageUrl,
      schoolId: data.schoolId,
      schoolName: data.schoolName,
    };
    const user = await createUserService(userData);
    data.userId = user.id;
    console.log(user, data);
    // Create a new teacher
    const newTeacher = await db.teacher.create({
      data,
    });
    console.log(
      `Učitel úspěšně vytvořil: ${newTeacher.firstName} (${newTeacher.id})`
    );
    res.status(201).json({ data: newTeacher, error: null });
  } catch (error) {
    console.error("Chyba databáze:", error);
    res.status(500).json({ error: "Chyba databáze: " + (error as Error).message });
  }
}

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

export async function getTeachersBySchoolId(req: Request, res: Response) {
  try {
    const { schoolId } = req.params;
    const teachers = await db.teacher.findMany({
      where: {
        schoolId,
      },
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
}
