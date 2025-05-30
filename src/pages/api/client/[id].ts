import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/auth";
import { z } from "zod";
import bcrypt from "bcrypt";

const updateClientSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  password: z.string().min(8).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const clientId = req.query.id as string;

  if (!clientId) {
    return res.status(400).json({ message: "Client ID is required" });
  }

  try {
    if (req.method === "PUT") {
      const parsed = updateClientSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(400)
          .json({ message: "Invalid input", errors: parsed.error.errors });
      }

      const { name, email, phone, password } = parsed.data;

      const updatedClient = await prisma.client.update({
        where: {
          id: clientId,
          managerId: decoded.userId, // ensures manager can only update their own clients
        },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(phone && { phone }),
          ...(password && { password: await bcrypt.hash(password, 10) }),
        },
      });

      return res
        .status(200)
        .json({ message: "Client Updated", client: updatedClient });
    } else if (req.method === "DELETE") {
      await prisma.client.delete({
        where: {
          id: clientId,
          managerId: decoded.userId, // again ensure access control
        },
      });

      return res.status(200).json({ message: "Client Deleted Successfully" });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
}
