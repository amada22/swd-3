import db from "@/lib/db";

export default async function handler(req, res) {

  // only allow GET
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {

    // get all events
    const [events] = await db.query(`
      SELECT * FROM events
      ORDER BY event_date ASC
    `);

    // send events
    res.status(200).json(events);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
}