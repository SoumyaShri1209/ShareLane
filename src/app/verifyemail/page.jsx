










"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/user/verifyemail", { token });
      setVerified(true);
      setError(false);

      // Show persistent toast
      toast.success("Signup successful! Email verified.");
    } catch (err) {
      setError(true);
      setVerified(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Toaster /> {/* Required for toast to show */}
      <h1 className="text-4xl m-10">Verify Email</h1>

      {verified && (
        <div className="text-center">
          <h2 className="text-2xl text-green-600 m-10">
            Email Verified Successfully!
          </h2>
          <Link href="/login" className="text-white text-2xl hover:underline">
            Go to Login
          </Link>
        </div>
      )}

      {error && (
        <div className="text-center">
          <h2 className="text-2xl text-red-500 m-10">
            Verification Failed. Invalid or Expired Token.
          </h2>
        </div>
      )}

      {!verified && !error && (
        <h2 className="p-2 bg-orange-500 text-black m-10">Verifying...</h2>
      )}
    </div>
  );
}







