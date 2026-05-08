export default function handler(req, res) {
    // remove the token cookie
    res.setHeader(
      "Set-Cookie",
      "token=; Path=/; HttpOnly; Max-Age=0"
    );
  
    res.status(200).json({ message: "Logged out" });
  }