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

    // get token from cookie
    const token = req.cookies.token;

    // check authentication
    if (!token) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    // verify token
    jwt.verify(token, process.env.JWT_SECRET);

    // get event id from request
    const { id } = req.body;

    // delete event
    await db.query(
      `
      DELETE FROM events
      WHERE id = ?
      `,
      [id]
    );

    // success response
    res.status(200).json({
      message: "Event deleted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
}