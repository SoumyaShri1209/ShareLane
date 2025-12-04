
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { data: session, status, update } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const loggedIn = status === "authenticated";

  const handleShowDropdown = () => setShowDropdown(true);
  const handleCloseDropdown = () => setShowDropdown(false);

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      await update();
      toast.success("Logout successful", { duration: 3000 });
      setShowDropdown(false);
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // ✅ Fetch latest user data (for updated name/avatar)
  useEffect(() => {
    async function fetchUser() {
      try {
        if (loggedIn && session?.user?._id) {
          const res = await fetch(`/api/user/${session.user._id}`, {
            cache: "no-store",
          });
          const data = await res.json();
          if (res.ok) {
            setProfileData(data);
          }
        }
      } catch (err) { 
        console.error("❌ Error loading user:", err);
      }
    }
    fetchUser();
  }, [loggedIn, session?.user?._id, refreshKey]);

  // ✅ Listen for profile updates (instant UI update)
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      console.log("📢 [Navbar] Profile update event received");

      // Instantly show the updated avatar if available
      if (event.detail && event.detail.avatarUrl) {
        setProfileData((prev) => ({
          ...prev,
          avatar: { url: event.detail.avatarUrl },
        }));
      }

      // Trigger re-fetch to stay in sync with DB
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  // ✅ Display data
  const userName =
    profileData?.username || session?.user?.name || session?.user?.email;
  const userAvatar = profileData?.avatar?.url || session?.user?.image || null;

  return (
    <nav className="flex justify-between items-center py-2 w-full px-4">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link href="/">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Share <span className="text-green-500">Lane.</span>
          </h2>
        </Link>
      </div>

      {/* Nav Links */}
      <ul className="flex items-center gap-4 md:gap-6 lg:gap-8 text-base md:text-lg lg:text-xl">
        <li>
          <Link
            href="/posts"
            className={`hover:underline hover:decoration-white underline-offset-1 ${
              pathname === "/posts" ? "text-yellow-300" : ""
            }`}
          >
            Blog
          </Link>
        </li>

        {loggedIn ? (
          <>
            <li>
              <Link
                href="/create-blog"
                className={`hover:underline hover:decoration-white underline-offset-2 ${
                  pathname === "/create-blog" ? "text-yellow-300" : ""
                }`}
              >
                Create
              </Link>
            </li>

            {/* ✅ Profile Avatar / Letter */}
            <li className="relative">
              <div
                onClick={handleShowDropdown}
                className="relative w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center cursor-pointer font-semibold text-lg overflow-hidden"
              >
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt="avatar"
                    fill
                    sizes="40px"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span>{userName?.charAt(0)?.toUpperCase() || "U"}</span>
                )}
              </div>

              {showDropdown && (
                <div className="absolute top-12 right-0 bg-gray-700 p-5 rounded-xl shadow-md z-50">
                  <AiOutlineClose
                    onClick={handleCloseDropdown}
                    className="w-full cursor-pointer mb-2"
                  />
                  <button
                    onClick={logout}
                    className="block w-full text-left hover:underline mb-2"
                  >
                    Logout
                  </button>
                  <Link
                    onClick={handleCloseDropdown}
                    href={`/user/${session?.user?._id}`}
                    className="block hover:underline"
                  >
                    Profile
                  </Link>
                </div>
              )}
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                href="/login"
                className={`hover:underline hover:decoration-white underline-offset-2 ${
                  pathname === "/login" ? "text-yellow-300" : ""
                }`}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className={`hover:underline hover:decoration-white underline-offset-2 ${
                  pathname === "/signup" ? "text-yellow-300" : ""
                }`}
              >
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;







