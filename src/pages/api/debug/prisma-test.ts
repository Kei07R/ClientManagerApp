// /src/pages/api/debug/prisma-test.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    res.status(200).json({ message: "Success", users });
  } catch (error: any) {
    console.error("🔥 Prisma error:", error); // Log in Vercel's build/logs tab

    res.status(500).json({
      message: "Internal Server Error",
      name: error?.name || null,
      code: error?.code || null,
      error: error?.message || String(error),
      stack: error?.stack || null,
    });
  }
}
