import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  const router = useRouter();

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

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events/get");
        const data = await res.json();

        if (Array.isArray(data)) {
          setEvents(data);
          setFilteredEvents(data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchEvents();
  }, []);

  function handleSearch(value) {
    setSearch(value);

    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredEvents(filtered);
  }

  function handleBook(id) {
    router.push(`/booking/${id}`);
  }

  async function logout() {
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
            <>
              <span style={{ marginRight: "10px" }}>
                {user.email} ({user.role})
              </span>

              {user.role === "attendee" && (
                <button
                  onClick={() => router.push("/mybookings")}
                  style={{ marginRight: "10px" }}
                >
                  My Bookings
                </button>
              )}

              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <h1>All Events</h1>

        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginBottom: "20px",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "15px",
          }}
        >
          {filteredEvents.length === 0 ? (
            <p>No events found</p>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "15px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <h3>{event.title}</h3>
                <p>{event.city}</p>
                <p>{event.event_type}</p>
                <p>{event.event_date}</p>
                <p>Capacity: {event.capacity}</p>

                <button
                  onClick={() => handleBook(event.id)}
                  style={{
                    marginTop: "10px",
                    padding: "8px",
                    width: "100%",
                    background: "black",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Book Event
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}