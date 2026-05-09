import db from "@/lib/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {

  // only allow GET
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {

    // get token
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // admin only
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    // get all users
    const [users] = await db.query(`
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY id DESC
    `);

    return res.status(200).json(users);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
}