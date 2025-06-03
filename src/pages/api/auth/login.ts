import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid Input",
        error: parsed.error.errors,
      });
    }

    const { email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return res.status(401).json({ message: "User Not Found" });
    }

    const passwordCompare = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordCompare) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    const token = jwt.sign(
      { userId: existingUser.id, role: existingUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login Successful",
      userId: existingUser.id,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
