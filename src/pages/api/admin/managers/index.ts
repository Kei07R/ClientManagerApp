import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Invalid Request Method",
    });
  }

  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  if (decoded.role !== "ADMIN") {
    return res.status(403).json({
      message: "Unauthorized Access: Admins only",
    });
  }

  try {
    const allManagers = await prisma.user.findMany({
      where: { role: "MANAGER" },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (allManagers.length === 0) {
      return res.status(404).json({
        message: "No Managers Found",
      });
    }

    return res.status(200).json({
      message: "Managers Fetched Successfully",
      managers: allManagers,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
}
