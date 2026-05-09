import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();

    try {

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created");
        router.push("/login");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
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
        onSubmit={handleRegister}
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
          Create Account
        </h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
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
          Register
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#8e8e93",
            marginTop: "10px",
            cursor: "pointer",
          }}
          onClick={() => router.push("/login")}
        >
          Already have an account? Login
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