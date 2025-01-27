
import { db } from "@/db/db";
import { ParentCreateProps, TypedRequestBody } from "@/types/types";
import { Request, Response } from "express";

export const createParent = async (req: TypedRequestBody<ParentCreateProps>, res: Response): Promise<void> => {
  const data = req.body;
  const { nationalId, phone, email, whatsappNumber, title, firstName, lastName, relationship, address, gender, dateOfBirth, nationality, contactMethod, occupation, password } = data;
  
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
    password
  };  

  try {
    // Check for existing entries
    const [existingEmail, existingNationalId, existingPhoneNumber] = await Promise.all([
      db.parent.findUnique({ where: { email } }),
      db.parent.findUnique({ where: { nationalId } }),
      db.parent.findUnique({ where: { phone } }),
      
    ]);

    if (existingNationalId) {
      res.status(409).json({ error: "Parent with this National ID already exists" });
      return;
    }
    if (existingEmail) {
      res.status(409).json({ error: "Parent with this Email already exists" });
      return;
    }
    if (existingPhoneNumber) {
      res.status(409).json({ error: "Parent with this Phone already exists" });
      return;
    }   

    // Create a new parent
    const newParent = await db.parent.create({ 
      data: formattedData 
    });
    console.log(`Parent created successfully: ${newParent.firstName} (${newParent.id})`);
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
      error: "Something went wrong"
    });
  }
}

