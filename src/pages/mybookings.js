import { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    const res = await fetch("/api/bookings/mybookings?user_id=1");
    const data = await res.json();
    setBookings(data);
  };

  const cancelBooking = async (eventId) => {
    const res = await fetch("/api/bookings/cancel", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 1,
        event_id: eventId,
      }),
    });

    const data = await res.json();
    setMessage(data.message);
    getBookings();
  };

  return (
    <div>
      <h1>My Bookings</h1>

      {message && <p>{message}</p>}

      {bookings.length === 0 && <p>No bookings found.</p>}

      {bookings.map((booking) => (
        <div key={booking.id}>
          <h3>{booking.title}</h3>
          <p>{booking.description}</p>
          <p>{booking.date}</p>
          <p>{booking.location}</p>

          <button onClick={() => cancelBooking(booking.event_id)}>
            Cancel Booking
          </button>
        </div>
      ))}
    </div>
  );
}