import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  const router = useRouter();

  // get logged in user
  useEffect(() => {

    async function getUser() {

      try {

        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          setUser(null);
          router.push("/login");
        }

      } catch (error) {

        console.log(error);

        setUser(null);
        router.push("/login");
      }
    }

    getUser();

  }, []);

  // get events
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

  // search
  function handleSearch(value) {

    setSearch(value);

    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredEvents(filtered);
  }

  // booking page
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

    const confirmDelete = confirm("Delete this event?");

    if (!confirmDelete) return;

    try {

      const res = await fetch("/api/events/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {

        const updatedEvents = events.filter(
          (event) => event.id !== id
        );

        setEvents(updatedEvents);
        setFilteredEvents(updatedEvents);

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
      }}
    >

      {/* navbar */}
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

        <h2 style={{ margin: 0 }}>
          Event System
        </h2>

        <div>

          {user && (
            <>

              <span
                style={{
                  marginRight: "15px",
                  color: "#d1d1d6",
                }}
              >
                {user.email} ({user.role})
              </span>

              {/* attendee */}
              {user.role === "attendee" && (
                <button
                  onClick={() => router.push("/mybookings")}
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
                  My Bookings
                </button>
              )}
              {/* admin */}
              {user.role === "admin" && (
                <button
                  onClick={() => router.push("/manageusers")}
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
                  Manage Users
                </button>
              )}
              {/* orginiser */}
              {user.role === "orginiser" && (
                <button
                  onClick={() => router.push("/myevents")}
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
                  Manage events
                </button>
              )}


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

      {/* content */}
      <div style={{ padding: "30px" }}>

        <h1 style={{ marginBottom: "20px" }}>
          All Events
        </h1>

        {/* search */}
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            padding: "12px",
            width: "320px",
            marginBottom: "30px",
            border: "1px solid #3a3a3c",
            borderRadius: "10px",
            backgroundColor: "#2c2c2e",
            color: "white",
            outline: "none",
          }}
        />

        {/* events grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >

          {filteredEvents.length === 0 ? (

            <p>No events found</p>

          ) : (

            filteredEvents.map((event) => (

              <div
                key={event.id}
                style={{
                  backgroundColor: "#2c2c2e",
                  border: "1px solid #3a3a3c",
                  borderRadius: "14px",
                  padding: "18px",
                }}
              >

                <h3 style={{ marginTop: 0 }}>
                  {event.title}
                </h3>

                <p style={{ color: "#d1d1d6" }}>
                  <strong>City:</strong> {event.city}
                </p>

                <p style={{ color: "#d1d1d6" }}>
                  <strong>Type:</strong> {event.event_type}
                </p>

                <p style={{ color: "#d1d1d6" }}>
                  <strong>Date:</strong> {event.event_date}
                </p>

                <p style={{ color: "#d1d1d6" }}>
                  <strong>Capacity:</strong> {event.capacity}
                </p>

                {/* book button */}
                <button
                  onClick={() => handleBook(event.id)}
                  style={{
                    marginTop: "12px",
                    padding: "10px",
                    width: "100%",
                    backgroundColor: "white",
                    color: "black",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Book Event
                </button>

                {/* admin delete */}
                {user?.role === "admin" && (

                  <button
                    onClick={() => deleteEvent(event.id)}
                    style={{
                      marginTop: "10px",
                      padding: "10px",
                      width: "100%",
                      backgroundColor: "#ff453a",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
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