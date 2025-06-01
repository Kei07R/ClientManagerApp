import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../../lib/auth";
import { z } from "zod";
import { prisma } from "../../../../../lib/prisma";
import { Role } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const updateManagerSchema = z.object({
    email: z.string().email().optional(),
    role: z.string().optional(),
  });

  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  if (decoded.role !== "ADMIN") {
    return res.status(403).json({
      message: "Unauthorized Access: Admins only",
    });
  }

  const managerId = req.query.id as string;

  if (!managerId) {
    return res.status(400).json({ message: "Manager ID is required" });
  }

  try {
    if (req.method === "PUT") {
      const parsed = updateManagerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: parsed.error.errors,
        });
      }

      const { email, role } = parsed.data;

      const updatedManager = await prisma.user.update({
        where: { id: managerId },
        data: {
          ...(email && { email }),
          ...(role && { role: role as Role }),
        },
      });

      return res.status(200).json({
        message: "Manager Updated",
        manager: updatedManager,
      });
    } else if (req.method === "DELETE") {
      await prisma.client.deleteMany({
        where: {
          managerId,
        },
      });

      await prisma.user.delete({
        where: {
          id: managerId,
        },
      });

      return res.status(200).json({
        message: "Manager and Clients Deleted Successfully",
      });
    } else {
      return res.status(405).json({
        message: "Invalid Request Method",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
}
