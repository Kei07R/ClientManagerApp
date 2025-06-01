import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../../lib/auth";
import { z } from "zod";
import { prisma } from "../../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const clientUpdateSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    managerId: z.string().optional(),
  });

  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  if (decoded.role !== "ADMIN") {
    return res.status(403).json({
      message: "Unauthorized Access: Admins only",
    });
  }

  const clientId = req.query.id as string;

  if (req.method === "PUT") {
    const parsed = clientUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.errors,
      });
    }

    const { name, email, phone, managerId } = parsed.data;

    if (managerId) {
      const managerExists = await prisma.user.findUnique({
        where: { id: managerId },
      });
      if (!managerExists || managerExists.role !== "MANAGER") {
        return res.status(400).json({ message: "Invalid managerId" });
      }
    }

    const updatedClient = await prisma.client.update({
      where: {
        id: clientId,
      },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(managerId && { managerId }),
      },
    });

    return res.status(200).json({
      message: "Client Updated",
      client: updatedClient,
    });
  } else if (req.method === "DELETE") {
    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!existingClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    await prisma.client.delete({
      where: {
        id: clientId,
      },
    });

    return res.status(200).json({
      message: "Client Deleted Successfully",
    });
  } else {
    return res.status(405).json({
      message: "Invalid Request Method",
    });
  }
}
