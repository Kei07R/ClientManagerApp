// pages/api/debug/prisma-test.ts
import { prisma } from "../../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    res.status(200).json({ message: "Success", users });
  } catch (error: any) {
    console.error("Prisma connection error:", error);
    res.status(500).json({
      message: "Failed to connect",
      error: error?.message || String(error),
    });
  }
}
