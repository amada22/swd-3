import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

      // redirect by role
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

    <div
      style={{
        backgroundColor: "#1c1c1e",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >

      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "#2c2c2e",
          padding: "30px",
          borderRadius: "14px",
          width: "340px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          border: "1px solid #3a3a3c",
        }}
      >

        <h2 style={{ marginBottom: "10px" }}>
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button style={buttonStyle}>
          Login
        </button>

        {error && (
          <p style={{ color: "#ff453a", fontSize: "13px" }}>
            {error}
          </p>
        )}

        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#8e8e93",
            cursor: "pointer",
          }}
          onClick={() => router.push("/register")}
        >
          Don't have an account? Register
        </p>

      </form>

    </div>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #3a3a3c",
  backgroundColor: "#1c1c1e",
  color: "white",
  outline: "none",
};

const buttonStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "white",
  color: "black",
  cursor: "pointer",
  fontWeight: "bold",
};