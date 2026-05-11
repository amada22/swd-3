import { useRouter } from "next/router";

export default function MyEvents() {
  const router = useRouter();

  // handle logout request
  async function handleLogout() {
    await fetch("/api/auth/logout");

    // send user back to login page
    router.push("/login");
  }

  return (
    <div>
      <h1>My Events</h1>

      <p>organiser events</p>


      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}