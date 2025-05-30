import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { verifyToken } from "../../../../lib/auth";

const clientSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(10),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const decoded = await verifyToken(req, res);

    if (!decoded) return;

    try {
      const parsed = clientSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid Inputs" });
      }

      const { name, email, password, phone } = parsed.data;

      const existingClient = await prisma.client.findUnique({
        where: {
          email,
        },
      });

      if (existingClient) {
        return res.status(400).json({ message: "Client Already Present" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newClient = await prisma.client.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          manager: {
            connect: { id: decoded.userId },
          },
        },
      });

      if (!newClient) {
        return res.status(401).json({ message: "Unable to Add Client" });
      }

      return res.status(201).json({
        message: "Client Added Successfully",
        client: {
          id: newClient.id,
          name: newClient.name,
          email: newClient.email,
          phone: newClient.phone,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  } else if (req.method === "GET") {
    const decoded = await verifyToken(req, res);
    if (!decoded) return;

    try {
      const managerClients = await prisma.client.findMany({
        where: {
          managerId: decoded.userId,
        },
      });

      if (managerClients.length === 0) {
        return res.status(404).json({
          message: "No Clients Found",
        });
      }

      return res.status(200).json({
        message: "Clients Fetched Successfully",
        managerClients,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
