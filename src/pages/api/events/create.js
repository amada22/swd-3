import db from "@/lib/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {

  // only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {

    // get token from cookies
    const token = req.cookies.token;

    // check token
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

    // get data from frontend
    const {
        title,
        description,
        city,
        event_type,
        event_date,
        capacity
      } = req.body;

    // insert event into database
    await db.query(
        `
        INSERT INTO events
        (
          title,
          description,
          city,
          event_type,
          event_date,
          capacity,
          organiser_id
        )
      
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          title,
          description,
          city,
          event_type,
          event_date,
          capacity,
          decoded.id
        ]
      );

    // success response
    res.status(201).json({
      message: "Event created successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
}