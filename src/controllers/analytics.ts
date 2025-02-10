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
    const result = [
      {
        title: "Students",
        count: students,
      },
      {
        title: "Teachers",
        count: teachers,
      },
      {
        title: "Parents",
        count: parents,
      },
      {
        title: "Classes",
        count: classes,
      },
    ];

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    }
};
