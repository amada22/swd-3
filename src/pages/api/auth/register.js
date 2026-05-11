import db from "@/lib/db";
import bcrypt from "bcryptjs";
export const config = {
    api: {
      bodyParser: true,
    },
  };
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash passeword using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "attendee"]
    );

    // Success response
    return res.status(200).json({ message: "User registered successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}