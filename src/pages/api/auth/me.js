import { jwtVerify } from "jose";

export default async function handler(req, res) {
  try {
    // get the token 
    const token = req.cookies.token;
    //if no token 
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }
// decoding token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
// compare tokens
    const { payload } = await jwtVerify(token, secret);
// response
    return res.status(200).json({
      id: payload.id,
      email: payload.email,
      role: payload.role
    });

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}