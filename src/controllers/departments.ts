import { db } from "@/db/db";
import { DepartmentCreateProps, TypedRequestBody } from "@/types/types";
import { generateSlug } from "@/utils/generateSlug";
import { Request, Response } from "express";

// Classes
export const createDepartment = async (
  req: TypedRequestBody<DepartmentCreateProps>,
  res: Response
): Promise<void> => {
  const data = req.body;
  const slug = generateSlug(data.name);
  data.slug = slug;
  try {
    // Check if the school already exists\
    const existingDepartment = await db.department.findUnique({
      where: {
        slug,
      },
    });
    if (existingDepartment) {
      res.status(409).json({
        data: null,
        error: "Oddělení již existuje",
      });
      return;
    }
    const newDepartment = await db.department.create({
      data,
    });
    console.log(
      `Oddělení úspěšně vytvořeno: ${newDepartment.name} (${newDepartment.id})`
    );
    res.status(201).json({
      data: newDepartment,
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

export async function getDepartments(
  req: Request,
  res: Response
): Promise<void> {
  try {
    
    const departments = await db.department.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        teachers: true,
        subjects: true,
      },
    });

    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Nepodařilo se načíst oddělení." });
  }
}

export async function getDepartmentsBySchoolId(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { schoolId } = req.params;
    const departments = await db.department.findMany({
      where: {
        schoolId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        teachers: true,
        subjects: true,
      },
    });
    res.status(200).json(departments);
  } catch (error) {
    console.error("Chyba při načítání oddělení:", error);
    res.status(500).json({ message: "Nepodařilo se načíst oddělení." });
  }
}

export async function getBriefDepartments(
  req: Request,
  res: Response
){
  try {
    const { schoolId } = req.params;
    const departments = await db.department.findMany({
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
    res.status(200).json(departments);
  } catch (error) {
    console.error("Chyba při načítání drief oddělení:", error);
    res.status(500).json({ message: "Nepodařilo se načíst brief oddělení." });
  }
}
