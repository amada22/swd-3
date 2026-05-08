import db from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const { user_id, event_id } = req.body;

    if (!user_id || !event_id) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    await db.query(
      "DELETE FROM bookings WHERE user_id = ? AND event_id = ?",
      [user_id, event_id]
    );

    return res.status(200).json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}