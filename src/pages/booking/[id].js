import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function BookingPage() {
  const router = useRouter();
  const { id } = router.query;

  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  }, []);

  const handleBooking = async () => {
    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
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

      {user && (
        <p>
          Logged in as: {user.email}
        </p>
      )}

      <button onClick={handleBooking}>
        Book Event
      </button>

      <p>{message}</p>
    </div>
  );
}