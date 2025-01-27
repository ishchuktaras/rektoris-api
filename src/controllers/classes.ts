import { db } from "@/db/db";
import {
  ClassCreateProps,
  StreamCreateProps,
  TypedRequestBody,
} from "@/types/types";
import { generateSlug } from "@/utils/generateSlug";
import { Request, Response } from "express";

// Classes
export const createClass = async (
  req: TypedRequestBody<ClassCreateProps>,
  res: Response
): Promise<void> => {
  const data = req.body;
  const slug = generateSlug(data.title);
  data.slug = slug;
  try {
    // Check if the school already exists\
    const existingClass = await db.class.findUnique({
      where: {
        slug,
      },
    });
    if (existingClass) {
      res.status(409).json({
        data: null,
        error: "Class already exists",
      });
      return;
    }
    const newClass = await db.class.create({
      data,
    });
    console.log(
      `Class created successfully: ${newClass.title} (${newClass.id})`
    );
    res.status(201).json({
      data: newClass,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
};

export async function getClasses(req: Request, res: Response): Promise<void> {
  try {
    const classes = await db.class.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        streams: {
          include: {
            _count: {
              select: {
                students: true, // Get the count of students in each stream
              },
            },
          },
        },
        _count: {
          select: {
            students: true, // Get the count of students directly associated with the class
          },
        },
      },
    });

    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Failed to fetch classes." });
  }
}

export async function getBriefClasses(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const classes = await db.class.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
      },
});

    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Failed to fetch classes." });
  }
}

// Streams
export async function createStream(
  req: TypedRequestBody<StreamCreateProps>,
  res: Response
): Promise<void> {
  const data = req.body;
  const slug = generateSlug(data.title);
  data.slug = slug;
  try {
    // Check if the Stream already exists\
    const existingStream = await db.stream.findUnique({
      where: {
        slug,
      },
    });
    if (existingStream) {
      res.status(409).json({
        data: null,
        error: "Stream already exists",
      });
      return;
    }
    const newStream = await db.stream.create({
      data,
    });
    console.log(
      `Stream created successfully: ${newStream.title} (${newStream.id})`
    );
    res.status(201).json({
      data: newStream,
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

export async function getStreams(req: Request, res: Response): Promise<void> {
  try {
    const streams = await db.stream.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(streams);
  } catch (error) {
    console.log(error);
  }
}
