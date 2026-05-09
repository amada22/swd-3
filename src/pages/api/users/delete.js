import db from "@/lib/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {

  // only allow DELETE
  if (req.method !== "DELETE") {
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

    const { id } = req.body;

    // prevent admin deleting himself
    if (decoded.id === id) {
      return res.status(400).json({
        message: "You cannot delete yourself"
      });
    }

    // delete user
    await db.query(
      `
      DELETE FROM users
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
}