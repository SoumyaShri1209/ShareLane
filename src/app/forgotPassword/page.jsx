"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/user/forgotPassword", { email });
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to send reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl mb-6">Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        className="p-2 border border-gray-300 rounded w-80 mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        disabled={loading}
        onClick={handleForgotPassword}
        className={`p-2 rounded bg-blue-600 text-white w-80 ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </div>
  );
}