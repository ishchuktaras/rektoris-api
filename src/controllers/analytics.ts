import { db } from "@/db/db";
import { Request, Response } from "express";

export const getAnalyticsBySchoolId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { schoolId } = req.params;
    const students = await db.user.count({
      where: {
        schoolId,
        role: "STUDENT",
      },
    });
    const teachers = await db.user.count({
      where: {
        schoolId,
        role: "TEACHER",
      },
    });
    const parents = await db.user.count({
      where: {
        schoolId,
        role: "PARENT",
      },
    });
    const classes = await db.class.count({
      where: {
        schoolId,
      },
    });
    const departments = await db.department.count({
          where: {
            schoolId,
          },
        });
    const result = [
      {
        title: "Studenti",
        count: students,
      },
      {
        title: "Učitelé",
        count: teachers,
      },
      {
        title: "Rodiče",
        count: parents,
      },
      {
        title: "Třídy",
        count: classes,
      },
      {
        title: "Oddělení",
        count: departments,
      },
    ];

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    }
};
