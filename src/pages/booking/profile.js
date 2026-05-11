
// app/profil/page.jsx

"use client";

import { useEffect, useState } from "react";

export default function ProfilPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // Load logged in user
  useEffect(() => {
    // Example user data
    // Replace this with your API or localStorage
    const loggedUser = {
      name: "Danny",
      email: "danny@gmail.com",
    };

    setUser(loggedUser);

    setFormData({
      name: loggedUser.name,
      email: loggedUser.email,
      password: "",
    });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Save changes
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Example API call
      // Replace with your backend route

      /*
      await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      */

      setMessage("Profile updated successfully!");

      setUser({
        name: formData.name,
        email: formData.email,
      });

      setFormData({
        ...formData,
        password: "",
      });
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 shadow-lg">
        
        <h1 className="text-3xl font-semibold text-white mb-2">
          My Profile
        </h1>

        <p className="text-gray-400 mb-8">
          View and update your account information.
        </p>

        {/* Current User Info */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 mb-8">
          <h2 className="text-lg text-white mb-4">Current Information</h2>

          <div className="space-y-2">
            <p className="text-gray-300">
              <span className="text-gray-500">Name:</span> {user.name}
            </p>

            <p className="text-gray-300">
              <span className="text-gray-500">Email:</span> {user.email}
            </p>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-gray-300 mb-2">
              Change Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500"
              placeholder="Enter new name"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Change Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500"
              placeholder="Enter new email"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Change Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500"
              placeholder="Enter new password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Save Changes
          </button>

          {message && (
            <p className="text-green-400 text-sm mt-2">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}