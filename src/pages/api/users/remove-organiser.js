import db from "@/lib/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {

  if (req.method !== "PUT") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const { id } = req.body;

    await db.query(
      `
      UPDATE users
      SET role = 'attendee'
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      message: "User removed from organiser"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
}