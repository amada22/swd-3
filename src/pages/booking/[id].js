import { useRouter } from "next/router";
import { useState } from "react";

export default function BookingPage() {
  const router = useRouter();
  const { id } = router.query;

  const [message, setMessage] = useState("");

  const handleBooking = async () => {
    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          event_id: id,
        }),
      });

      const data = await response.json();

      setMessage(data.message);
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Book Event</h1>

      <p>Event ID: {id}</p>

      <button onClick={handleBooking}>
        Book Event
      </button>

      <p>{message}</p>
    </div>
  );
}