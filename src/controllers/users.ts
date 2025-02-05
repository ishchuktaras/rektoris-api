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

export const createUser = async (
  req: TypedRequestBody<UserCreateProps>,
  res: Response
): Promise<void> => {
  const data = req.body;
  const { email, password, role, name, phone, image, schoolId, schoolName } =
    data;

  try {
    // Check if the user exists
    const existingEmail = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingEmail) {
      res.status(409).json({
        data: null,
        error: "Email již existuje",
      });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;
    const newUser = await db.user.create({
      data,
    });
    console.log(
      `Nový uživatel byl úspěšně vytvořen: ${newUser.name}(id: ${newUser.id})`
    );
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
