
import { db } from "@/db/db";
import { generateSlug } from "@/utils/generateSlug";
import { Request, Response } from "express";

export const createSchool = async (req: Request, res: Response): Promise<void> => {
  const { name, logo } = req.body;
  const slug = generateSlug(name);
  try {
    // Check if the school already exists\
    const existingSchool = await db.school.findUnique({
      where: {
        slug,
      },
    });
    if (existingSchool) {
       res.status(409).json({
        data: null,
        error: "Škola s tímto názvem již existuje",
      });
      return
    }
    const newSchool = await db.school.create({
      data: {
        name,
        slug,
        logo        
      },
    });
    console.log(
      `Škola byla úspěšně vytvořena: ${newSchool.name} (${newSchool.id})`);
      const {createdAt, updatedAt, ...others}=newSchool
    res.status(201).json({
      data: others,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Něco se pokazilo",
    });
  }
}
export const getSchools = async (req: Request, res: Response): Promise<void> => {
  try {
    const schools = await db.school.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(schools);
  } catch (error) {
    console.log(error);
  }
}

