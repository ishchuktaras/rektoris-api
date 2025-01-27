
import { db } from "@/db/db";
import { ContactProps, TypedRequestBody } from "@/types/types";

import { Request, Response } from "express";

export const createContact = async( req: TypedRequestBody<ContactProps>, res: Response): Promise<void> => {
  const data = req.body;
  const {email, schoolName} = data;
  try {
    // Check if the school already exists\
    const existingEmail = await db.contact.findUnique({
      where: {
        email,
      },
    });
    const existingSchool = await db.contact.findUnique({
      where: {
        schoolName,
      },
    });
    if (existingSchool || existingEmail) {
      res.status(409).json({
        data: null,
        error: "We have already recieved a request for this school or email",
      });
    }
    const newContact = await db.contact.create({
      data
    });
    console.log(
      `Contact created successfully: ${newContact.schoolName} (${newContact.id})`);
    res.status(201).json({
      data: newContact,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
}
export const getContacts =async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await db.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(contacts);
  } catch (error) {
    console.log(error);
  }
}

