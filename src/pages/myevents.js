import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MyEvents() {
  const router = useRouter();

  const emptyForm = {
    title: "",
    description: "",
    city: "",
    event_type: "",
    event_date: "",
    capacity: "",
  };

  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

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

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function saveEvent(e) {
    e.preventDefault();

    const url = editId
      ? "/api/events/update"
      : "/api/events/create";

    const method = editId ? "PUT" : "POST";

    const body = editId
      ? { id: editId, ...form }
      : form;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    setMessage(data.message);

    setForm(emptyForm);
    setEditId(null);

    if (user) {
      getEvents(user.id);
    }
  }

  function startEdit(event) {
    setEditId(event.id);

    setForm({
      title: event.title || "",
      description: event.description || "",
      city: event.city || "",
      event_type: event.event_type || "",
      event_date: event.event_date
        ? event.event_date.slice(0, 16)
        : "",
      capacity: event.capacity || "",
    });
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

        <form
          onSubmit={saveEvent}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "25px",
          }}
        >
          <h2>{editId ? "Update Event" : "Create Event"}</h2>

          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px" }}
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px" }}
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px" }}
          />

          <input
            name="event_type"
            placeholder="Event type"
            value={form.event_type}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px" }}
          />

          <input
            name="event_date"
            type="datetime-local"
            value={form.event_date}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px" }}
          />

          <input
            name="capacity"
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px" }}
          />

          <button type="submit">
            {editId ? "Update Event" : "Create Event"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm(emptyForm);
              }}
              style={{ marginLeft: "10px" }}
            >
              Cancel Edit
            </button>
          )}
        </form>

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
                onClick={() => startEdit(event)}
                style={{
                  marginRight: "10px",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                Edit Event
              </button>

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