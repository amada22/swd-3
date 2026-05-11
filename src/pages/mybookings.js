import { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);

        if (data.id) {
          getBookings(data.id);
        }
      });
  }, []);

  const getBookings = async (userId) => {
  const res = await fetch(
    `/api/bookings/mybookings?user_id=${userId}`
  );

  const data = await res.json();

  if (Array.isArray(data)) {
    setBookings(data);
  } else {
    setBookings([]);
    setMessage(data.message || "Could not load bookings");
  }
};

  const cancelBooking = async (eventId) => {
    const res = await fetch("/api/bookings/cancel", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        event_id: eventId,
      }),
    });

    const data = await res.json();

    setMessage(data.message);

    getBookings(user.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Bookings</h1>

      {message && <p>{message}</p>}

      {bookings.length === 0 && (
        <p>No bookings found.</p>
      )}

      {bookings.map((booking) => (
        <div
          key={booking.id}
          style={{
            border: "1px solid white",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3>{booking.title}</h3>

          <p>{booking.description}</p>

          <button
            onClick={() =>
              cancelBooking(booking.event_id)
            }
          >
            Cancel Booking
          </button>
        </div>
      ))}
    </div>
  );
}