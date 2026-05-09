import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ManageUsers() {

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  const router = useRouter();

  // get current user (for navbar)
  useEffect(() => {
    async function getMe() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (res.ok) setUser(data);
        else router.push("/login");

      } catch (err) {
        router.push("/login");
      }
    }

    getMe();
  }, []);

  // fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users/get");
      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // logout
  async function logout() {
    await fetch("/api/auth/logout");
    router.push("/login");
  }

  // delete user
  async function deleteUser(id) {

    const confirmDelete = confirm("Delete this user?");
    if (!confirmDelete) return;

    await fetch("/api/users/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setUsers(users.filter((u) => u.id !== id));
  }

  // make organiser
  async function makeOrganiser(id) {

    await fetch("/api/users/make-organiser", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: "organiser" } : u
      )
    );
  }

  // remove organiser
  async function removeOrganiser(id) {

    await fetch("/api/users/remove-organiser", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: "attendee" } : u
      )
    );
  }

  return (

    <div style={{ backgroundColor: "#1c1c1e", minHeight: "100vh", color: "white" }}>

      {/* NAVBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px 24px",
          backgroundColor: "#2c2c2e",
          borderBottom: "1px solid #3a3a3c",
        }}
      >

        <h2
        style={{
            margin: 0,
            fontWeight: "700",
            letterSpacing: "1px",
            color: "white",
        }}
        >
        Manage<span style={{ color: "#8e8e93" }}>Users</span>
        </h2>

        <div>

          {user && (
            <>
              <span style={{ marginRight: "15px", color: "#d1d1d6" }}>
                {user.email} ({user.role})
              </span>

              <button
                onClick={() => router.push("/")}
                style={{
                  marginRight: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#3a3a3c",
                  color: "white",
                  border: "1px solid #4a4a4c",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Home
              </button>

              <button
                onClick={logout}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#3a3a3c",
                  color: "white",
                  border: "1px solid #4a4a4c",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "30px" }}>

        {users.map((userItem) => (

          <div
            key={userItem.id}
            style={{
              backgroundColor: "#2c2c2e",
              border: "1px solid #3a3a3c",
              borderRadius: "14px",
              padding: "18px",
              marginBottom: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >

            {/* LEFT */}
            <div>
              <h3 style={{ margin: 0 }}>{userItem.name}</h3>
              <p style={{ color: "#d1d1d6" }}>{userItem.email}</p>
              <p style={{ color: "#8e8e93" }}>
                Role: {userItem.role}
              </p>
            </div>

            {/* RIGHT */}
            <div style={{ display: "flex", gap: "10px" }}>

              {userItem.role !== "admin" && (
                userItem.role === "attendee" ? (
                  <button
                    onClick={() => makeOrganiser(userItem.id)}
                    style={{
                      padding: "10px 14px",
                      backgroundColor: "#3a3a3c",
                      color: "white",
                      border: "1px solid #4a4a4c",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Make Organiser
                  </button>
                ) : (
                  <button
                    onClick={() => removeOrganiser(userItem.id)}
                    style={{
                      padding: "10px 14px",
                      backgroundColor: "#3a3a3c",
                      color: "white",
                      border: "1px solid #4a4a4c",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Remove Organiser
                  </button>
                )
              )}

              <button
                onClick={() => deleteUser(userItem.id)}
                style={{
                  padding: "10px 14px",
                  backgroundColor: "#ff453a",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}