import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Wrong Request Method" });
  }

  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  const userId = decoded.userId;

  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    let clientsCount = 0;

    if (userProfile.role === "ADMIN") {
      const clients = await prisma.client.findMany();
      clientsCount = clients.length;
    } else if (userProfile.role === "MANAGER") {
      const clients = await prisma.client.findMany({
        where: { managerId: userId },
      });
      clientsCount = clients.length;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    return res.status(200).json({
      message: "Profile fetched",
      data: {
        id: userProfile.id,
        email: userProfile.email,
        role: userProfile.role,
        clients: clientsCount,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
