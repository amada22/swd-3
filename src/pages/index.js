import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  const router = useRouter();

  // get user
  useEffect(() => {

    async function getUser() {

      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          router.push("/login");
        }

      } catch (error) {
        router.push("/login");
      }
    }

    getUser();

  }, []);

  // get events
  useEffect(() => {

    async function fetchEvents() {

      const res = await fetch("/api/events/get");
      const data = await res.json();

      if (Array.isArray(data)) {
        setEvents(data);
        setFilteredEvents(data);
      }
    }

    fetchEvents();

  }, []);

  // search
  function handleSearch(value) {

    setSearch(value);

    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredEvents(filtered);
  }

  // book
  function handleBook(id) {
    router.push(`/booking/${id}`);
  }

  // logout
  async function logout() {
    await fetch("/api/auth/logout");
    router.push("/login");
  }

  // delete event
  async function deleteEvent(id) {

    if (!confirm("Delete this event?")) return;

    const res = await fetch("/api/events/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const updated = events.filter((e) => e.id !== id);
      setEvents(updated);
      setFilteredEvents(updated);
    }
  }

  return (

    <div style={{ backgroundColor: "#1c1c1e", minHeight: "100vh", color: "white" }}>

      {/* NAVBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          backgroundColor: "#2c2c2e",
          borderBottom: "1px solid #3a3a3c",
          position: "sticky",
          top: 0,
        }}
      >

        <h2
          style={{
            margin: 0,
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          Event<span style={{ color: "#8e8e93" }}>System</span>
        </h2>

        <div>

          {user && (
            <>

              <span style={{ marginRight: "15px", color: "#d1d1d6" }}>
                {user.email} ({user.role})
              </span>

              {user.role === "attendee" && (
                <button style={btn} onClick={() => router.push("/mybookings")}>
                  My Bookings
                </button>
              )}

              {user.role === "admin" && (
                <button style={btn} onClick={() => router.push("/manageusers")}>
                  Manage Users
                </button>
              )}

              {user.role === "organiser" && (
                <button style={btn} onClick={() => router.push("/myevents")}>
                  Manage Events
                </button>
              )}

              <button style={btn} onClick={logout}>
                Logout
              </button>

            </>
          )}

        </div>

      </div>

      {/* CENTER WRAPPER */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>

        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          All Events
        </h1>

        {/* search */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={searchStyle}
          />
        </div>

        {/* events */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >

          {filteredEvents.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%" }}>
              No events found
            </p>
          ) : (

            filteredEvents.map((event) => (

              <div key={event.id} style={card}>

                <h3>{event.title}</h3>

                <p><strong>City:</strong> {event.city}</p>
                <p><strong>Type:</strong> {event.event_type}</p>
                <p><strong>Date:</strong> {event.event_date}</p>
                <p><strong>Capacity:</strong> {event.capacity}</p>

                <button style={bookBtn} onClick={() => handleBook(event.id)}>
                  Book Event
                </button>

                {user?.role === "admin" && (
                  <button style={deleteBtn} onClick={() => deleteEvent(event.id)}>
                    Delete Event
                  </button>
                )}

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

/* styles */

const btn = {
  marginRight: "10px",
  padding: "8px 12px",
  backgroundColor: "#3a3a3c",
  color: "white",
  border: "1px solid #4a4a4c",
  borderRadius: "8px",
  cursor: "pointer",
};

const searchStyle = {
  padding: "12px",
  width: "420px",
  border: "1px solid #3a3a3c",
  borderRadius: "10px",
  backgroundColor: "#2c2c2e",
  color: "white",
  outline: "none",
};

const card = {
  backgroundColor: "#2c2c2e",
  border: "1px solid #3a3a3c",
  borderRadius: "14px",
  padding: "18px",
};

const bookBtn = {
  marginTop: "12px",
  padding: "10px",
  width: "100%",
  backgroundColor: "white",
  color: "black",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
};

const deleteBtn = {
  marginTop: "10px",
  padding: "10px",
  width: "100%",
  backgroundColor: "#ff453a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};