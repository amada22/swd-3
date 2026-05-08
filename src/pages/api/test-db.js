import db from "@/lib/db";

export default async function handler(req, res) {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
}