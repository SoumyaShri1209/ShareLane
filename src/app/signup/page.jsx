"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signIn } from "next-auth/react";
import toast, { Toaster } from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Normal signup
  const onSignup = async () => {
    try {
      setLoading(true);
      await axios.post("/api/user/signup", user);

      // 🟢 Persistent success toast
      toast.success("Verification link sent to your email! Check your inbox.", {duration:9000});
      router.push("/login");

    } catch (error) {
      // Prefer server-provided error message when available (safe access without optional chaining)
      const serverMessage =
        error && error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : error && error.message
          ? error.message
          : "Signup failed";

      // Suppress console error for the common 'User already exists' case
      const isDuplicateUserError =
        error && error.response && error.response.status === 400 && serverMessage === "User already exists";

      if (!isDuplicateUserError) {
        // Safe logging for unexpected errors
        if (error && error.response) {
          console.error("Signup error (response):", error.response);
        } else if (error && error.message) {
          console.error("Signup error (message):", error.message);
        } else {
          console.error("Signup error:", error);
        }
      }

      toast.error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  // Enable the signup button only if all fields are filled
  useEffect(() => {
    setButtonDisabled(
      !(user.username.length > 0 && user.email.length > 0 && user.password.length > 0)
    );
  }, [user]);

  // Google signup
  const handleGoogleSignup = async () => {
    try {
      await signIn("google", { callbackUrl: "/login" });
    } catch (error) {
      toast.error("Google Sign-in failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      {/* 🔔 Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="shadow-xl w-[420px] p-8 rounded-xl border-2 bg-gray-800 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-green-500 mb-6">
          {loading ? "Processing..." : "Signup"}
        </h1>

        {/* Username */}
        <div className="w-full mb-4">
          <label className="block text-white mb-1" htmlFor="username">Username</label>
          <input
            className="bg-white p-2 text-black border border-gray-300 w-full rounded-lg focus:outline-none focus:border-gray-600"
            type="text"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your username"
          />
        </div>

        {/* Email */}
        <div className="w-full mb-4">
          <label className="block text-white mb-1" htmlFor="email">Email</label>
          <input
            className="bg-white p-2 text-black border border-gray-300 w-full rounded-lg focus:outline-none focus:border-gray-600"
            type="text"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="w-full mb-6 relative">
          <label className="block text-white mb-1" htmlFor="password">Password</label>
          <input
            className="bg-white p-2 pr-10 text-black border border-gray-300 w-full rounded-lg focus:outline-none focus:border-gray-600"
            type={showPassword ? "text" : "password"}
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/70 text-gray-600 hover:text-gray-800"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Sign Up Button */}
        <button
          onClick={onSignup}
          disabled={buttonDisabled}
          className={`w-full p-2 rounded-lg text-white font-semibold mb-4 ${
            buttonDisabled
              ? "bg-green-600 opacity-50 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Sign Up
        </button>

        {/* Google Sign-up */}
        <button
          onClick={handleGoogleSignup}
          className="w-full p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mb-4 flex items-center justify-center gap-2"
        >
          Sign Up with Google
        </button>

        {/* Already have account */}
        <Link className="text-blue-300 hover:underline mb-3" href="/login">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}








