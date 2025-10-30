




"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false, // do not auto-redirect
        email: user.email,
        password: user.password,
      });

      if (result?.error) {
        toast.error("Incorrect email or password", { duration: 3000 });
      } else {
        toast.success("Logged in successfully!", { duration: 3000 });
        router.push("/blog"); // navigate to blog after login
      }
    } catch (error) {
      toast.error("Login failed. Try again.", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="shadow-xl w-[420px] p-8 rounded-xl border-2 bg-gray-800 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-green-500 mb-6">
          {loading ? "Processing..." : "Login"}
        </h1>

        {/* Email Input */}
        <div className="w-full mb-4">
          <label className="block text-white mb-1" htmlFor="email">
            Email
          </label>
          <input
            className="bg-white p-2 text-black border border-gray-300 w-full rounded-lg focus:outline-none focus:border-gray-600"
            type="text"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>

        {/* Password Input */}
        <div className="w-full mb-6">
          <label className="block text-white mb-1" htmlFor="password">
            Password
          </label>
          <div className="relative w-full">
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
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={onLogin}
          disabled={buttonDisabled}
          className={`w-full p-2 rounded-lg text-white font-semibold mb-4 ${
            buttonDisabled
              ? "bg-green-600 opacity-50 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Links */}
        <Link
          className="text-blue-300 hover:underline mb-3"
          href="/signup"
        >
          Don’t have an account? Sign up
        </Link>

        <Link
          href="/forgotPassword"
          className="text-blue-300 hover:underline bg-transparent border-none cursor-pointer"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
