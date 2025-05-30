import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export interface DecodedToken {
  userId: string;
  role: string;
}

export async function verifyToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<DecodedToken | null> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" });

      return null;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    return decoded;
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });

    return null;
  }
}
