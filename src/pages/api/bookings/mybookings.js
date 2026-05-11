import db from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const [bookings] = await db.query(
  `
  SELECT 
    bookings.id,
    bookings.event_id,
    events.title,
    events.description,
    events.city,
    events.event_type,
    events.event_date,
    events.capacity
  FROM bookings
  JOIN events ON bookings.event_id = events.id
  WHERE bookings.user_id = ?
  `,
  [user_id]
);

    return res.status(200).json(bookings);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}