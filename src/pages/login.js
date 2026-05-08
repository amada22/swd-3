import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  // store form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // store error message
  const [error, setError] = useState("");

  // handle login submit
  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      // redirect after login based on role
      if (data.role === "admin") {
        router.push("/manageusers");
      } else if (data.role === "organiser") {
        router.push("/myevents");
      } else {
        router.push("/");
      }

    } catch (err) {
      setError("Something went wrong");
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>


      {error && <p>{error}</p>}
    </div>
  );
}