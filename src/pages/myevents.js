import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MyEvents() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const res = await fetch("/api/auth/me");
    const data = await res.json();

    if (!res.ok) {
      router.push("/login");
      return;
    }

    setUser(data);
    getEvents(data.id);
  }

  async function getEvents(userId) {
    const res = await fetch("/api/events/get");
    const data = await res.json();

    if (Array.isArray(data)) {
      const myEvents = data.filter(
        (event) => event.organiser_id === userId
      );

      setEvents(myEvents);
    }
  }

  async function deleteEvent(id) {
    const confirmDelete = confirm("Delete this event?");

    if (!confirmDelete) {
      return;
    }

    const res = await fetch("/api/events/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    setMessage(data.message);

    if (user) {
      getEvents(user.id);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout");
    router.push("/login");
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "15px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2>Event System</h2>

        <div>
          {user && (
            <span style={{ marginRight: "10px" }}>
              {user.email} ({user.role})
            </span>
          )}

          <button onClick={() => router.push("/")}>
            Home
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <h1>My Events</h1>

        {message && <p>{message}</p>}

        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
              }}
            >
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>{event.city}</p>
              <p>{event.event_type}</p>
              <p>{event.event_date}</p>
              <p>Capacity: {event.capacity}</p>

              <button
                onClick={() => deleteEvent(event.id)}
                style={{
                  background: "darkred",
                  color: "white",
                  padding: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete Event
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}