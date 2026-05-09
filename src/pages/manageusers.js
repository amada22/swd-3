import { useEffect, useState } from "react";

export default function ManageUsers() {

  const [users, setUsers] = useState([]);

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

  // delete user
  async function deleteUser(id) {

    const confirmDelete = confirm("Delete this user?");
    if (!confirmDelete) return;

    try {

      const res = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
    }
  }

  // make organiser
  async function makeOrganiser(id) {

    try {

      const res = await fetch("/api/users/make-organiser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {

        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, role: "organiser" } : u
          )
        );

      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
    }
  }

  // remove organiser
  async function removeOrganiser(id) {

    try {

      const res = await fetch("/api/users/remove-organiser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {

        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, role: "attendee" } : u
          )
        );

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
        minHeight: "100vh",
        color: "white",
        padding: "30px",
      }}
    >

      <h1 style={{ marginBottom: "25px" }}>
        Manage Users
      </h1>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (

          <div
            key={user.id}
            style={{
              backgroundColor: "#2c2c2e",
              border: "1px solid #3a3a3c",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >

            {/* left */}
            <div>

              <h3 style={{ margin: 0 }}>
                {user.name}
              </h3>

              <p style={{ color: "#d1d1d6" }}>
                {user.email}
              </p>

              <p style={{ color: "#8e8e93" }}>
                Role: {user.role}
              </p>

            </div>

            {/* right */}
            <div style={{ display: "flex", gap: "10px" }}>

              {/* role buttons */}
              {user.role !== "admin" && (
                <>
                  {user.role === "attendee" ? (
                    <button
                      onClick={() => makeOrganiser(user.id)}
                      style={{
                        padding: "10px 14px",
                        backgroundColor: "#3a3a3c",
                        color: "white",
                        border: "1px solid #4a4a4c",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Make Organiser
                    </button>
                  ) : (
                    <button
                      onClick={() => removeOrganiser(user.id)}
                      style={{
                        padding: "10px 14px",
                        backgroundColor: "#3a3a3c",
                        color: "white",
                        border: "1px solid #4a4a4c",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Remove Organiser
                    </button>
                  )}
                </>
              )}

              {/* delete */}
              <button
                onClick={() => deleteUser(user.id)}
                style={{
                  padding: "10px 14px",
                  backgroundColor: "#ff453a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>

            </div>

          </div>

        ))
      )}

    </div>
  );
}