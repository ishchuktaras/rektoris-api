import { db } from "@/db/db";
import {
  TypedRequestBody,
  UserCreateProps,
  UserLoginProps,
} from "@/types/types";
import bcrypt from "bcrypt";
import { TokenPayload } from "@/utils/tokens";
import { generateAccessToken, generateRefreshToken } from "@/utils/tokens";
import e, { Request, Response } from "express";
import { User, UserRole } from "@prisma/client";

export async function createUserService(data: UserCreateProps) {
  const existingEmail = await db.user.findUnique({
    where: { email: data.email },
  });

  if (existingEmail) {
    throw new Error("Email již existuje");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userData = { ...data, password: hashedPassword };

  const newUser = await db.user.create({
    data: userData,
  });

  console.log(`Uživatel byl úspěšně vytvořen: ${newUser.name} (${newUser.id})`);
  return newUser;
}

export const createUser = async (
  req: TypedRequestBody<UserCreateProps>,
  res: Response
): Promise<void> => {
  const data = req.body;

  try {
    const newUser = await createUserService(req.body);
    res.status(201).json({
      data: newUser,
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

export const loginUser = async (
  req: TypedRequestBody<UserLoginProps>,
  res: Response
): Promise<void> => {
  const data = req.body;
  const { email, password } = data;

  try {
    // Check if the user exists
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      res.status(409).json({
        data: null,
        error: "Neplatné přihlašovací údaje",
      });
      return;
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      res.status(409).json({
        data: null,
        error: "Neplatné přihlašovací údaje",
      });
      return;
    }
    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store the refresh token in the database
    await db.refreshToken.create({
      data: {
        token: refreshToken,
        userId: existingUser.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Remove sensitive data
    const { password: _, ...userWithoutPassword } = existingUser;

    res.status(200).json({
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      },
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

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Při načítání předmětu došlo k chybě:", error);
    res.status(500).json({ message: "Nepodařilo se načíst předmět." });
  }
}

export async function getUserProfileId(req: Request, res: Response) {
  const { userId } = req.params;
  const { role } = req.query;
  const userRole = role as UserRole;
  let profileId = null;

  try {
    if (userRole === "PARENT") {
      profileId = await db.student.findUnique({
        where: {
          userId,
        },
        select: {
          id: true,
        },
      });
      res.status(200).json(profileId);
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Něco se pokazilo",
    });
  }
}

export async function getNextStudentSequence(req: Request, res: Response) {
  const { schoolId } = req.params;
  if (!schoolId) {
    res.status(400).json({ error: "Chybí ID školy" });
    return;
  }
  try {
    const sequence = await db.student.findFirst({
      where: {
        schoolId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // "ZS/PS/2025/001"
    const lastStudent = await db.student.findFirst({
      where: {
        schoolId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const stringSequence = lastStudent?.regNo.split("/")[3];
    const lastSequence = stringSequence ? parseInt(stringSequence) : 0;
    const nextSequence = lastSequence + 1;
    res.status(200).json(nextSequence);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Nepodařilo se získat další sekvenci studentů.",
    });
  }
}
