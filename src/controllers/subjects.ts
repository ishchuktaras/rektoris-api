import { db } from "@/db/db";
import { SubjectCreateProps, TypedRequestBody } from "@/types/types";
import { generateSlug } from "@/utils/generateSlug";
import { Request, Response } from "express";

// Classes
export const createSubject = async (
  req: TypedRequestBody<SubjectCreateProps>,
  res: Response
): Promise<void> => {
  const data = req.body;
  const slug = generateSlug(data.name);
  data.slug = slug;
  try {
    // Check if the school already exists\
    const existingSubject = await db.subject.findUnique({
      where: {
        slug,
      },
    });
    if (existingSubject) {
      res.status(409).json({
        data: null,
        error: "Předmět již existuje",
      });
      return;
    }
    const newSubject = await db.subject.create({
      data,
    });
    console.log(
      `Předmět úspěšně vytvořeno: ${newSubject.name} (${newSubject.id})`
    );
    res.status(201).json({
      data: newSubject,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Něco se pokazilo",
    });
  }
};

export async function getSubjects(req: Request, res: Response): Promise<void> {
  try {
    const subjects = await db.subject.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Při načítání předmětu došlo k chybě:", error);
    res.status(500).json({ message: "Nepodařilo se načíst předmět." });
  }
}

export async function getSubjectsBySchoolId(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { schoolId } = req.params;
    const subjects = await db.subject.findMany({
      where: {
        schoolId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Při načítání předmětu došlo k chybě:", error);
    res.status(500).json({ message: "Nepodařilo se načíst předmět." });
  }
}

export async function getBriefSubjects(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { schoolId } = req.params;
    const subjects = await db.subject.findMany({
      where:{
        schoolId
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Při načítání předmětu došlo k chybě:", error);
    res.status(500).json({ message: "Nepodařilo se načíst předmět." });
  }
}
