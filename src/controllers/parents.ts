
import { db } from "@/db/db";
import { ParentCreateProps, TypedRequestBody } from "@/types/types";
import { UserRole } from "@prisma/client";
import { Request, Response } from "express";
import { createUserService } from "./users";

export const createParent = async (req: TypedRequestBody<ParentCreateProps>, res: Response): Promise<void> => {
  const data = req.body;
  const { nationalId, phone, email, whatsappNumber, title, firstName, lastName, relationship, address, gender, dateOfBirth, nationality, contactMethod, occupation, password, user} = data;
  
  const formattedData = {
    nationalId,
    phone,
    email,
    whatsappNumber,
    title,
    firstName,
    lastName,
    relationship,
    address,
    gender,
    dateOfBirth: new Date(data.dateOfBirth),
    nationality,
    contactMethod,
    occupation,
    password,
    user: { connect: { id: user } },
  };  

  try {
    // Check for existing entries
    const [existingEmail, existingNationalId, existingPhoneNumber] = await Promise.all([
      db.parent.findUnique({ where: { email } }),
      db.parent.findUnique({ where: { nationalId } }),
      db.parent.findUnique({ where: { phone } }),
      
    ]);

    if (existingNationalId) {
      res.status(409).json({ error: "Rodič s tímto občanským průkazem již existuje" });
      return;
    }
    if (existingEmail) {
      res.status(409).json({ error: "Rodič s tímto e-mailem již existuje" });
      return;
    }
    if (existingPhoneNumber) {
      res.status(409).json({ error: "Rodič s tímto telefonem již existuje" });
      return;
    }

     // Create a student as a user
        const userData = {
          email: data.email,
          password: data.password,
          role: "PARENT" as UserRole,
          name: `${data.firstName} ${data.lastName}`,
          phone: data.phone,
          image: data.imageUrl,
          schoolId: data.schoolId,
          schoolName: data.schoolName,
        };
        const user = await createUserService(userData);
        data.userId = user.id;


    // Create a new parent
    const newParent = await db.parent.create({ 
      data: formattedData 
    });
    console.log(`Rodič byl úspěšně vytvořen: ${newParent.firstName} (${newParent.id})`);
    res.status(201).json({ data: newParent });
  } catch (error: any) {
    console.error("Database error:", error); // Add more logging here
    res.status(500).json({ error: "Database error: " + error.message });
  }
};

export const getParents = async(req: Request, res: Response): Promise<void> =>
{
  try {
    const parents = await db.parent.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(parents);
    return
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Něco se pokazilo"
    });
  }
}

