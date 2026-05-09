import db from "@/lib/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {

  // only allow PUT
  if (req.method !== "PUT") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {

    // get token
    const token = req.cookies.token;

    // check login
    if (!token) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    // verify token
    jwt.verify(token, process.env.JWT_SECRET);

    // get updated data
    const {
      id,
      title,
      description,
      city,
      event_type,
      event_date,
      capacity
    } = req.body;

    // update event
    await db.query(
      `
      UPDATE events

      SET
        title = ?,
        description = ?,
        city = ?,
        event_type = ?,
        event_date = ?,
        capacity = ?

      WHERE id = ?
      `,
      [
        title,
        description,
        city,
        event_type,
        event_date,
        capacity,
        id
      ]
    );

    // success response
    res.status(200).json({
      message: "Event updated successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
}