
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    location: "",
    about: "",
    designation: "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);

  // 🔹 Fetch user details
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/user/${id}`);
        const data = await res.json();

        if (res.ok) {
          setUser(data);
          setFormData({
            username: data.username || "",
            age: data.age || "",
            location: data.location || "",
            about: data.about || "",
            designation: data.designation || "",
            avatar: data.avatar?.url || null,
          });
          setPreview(data.avatar?.url || null);
        } else {
          alert(data.message || "User not found");
        }
      } catch (err) {
        console.error("❌ [fetchUser Error]:", err);
      }
    }

    if (id) fetchUser();
  }, [id]);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🔹 Handle new image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Remove current image
  const handleRemoveImage = async () => {
    try {
      setPreview(null);
      setFormData((prev) => ({ ...prev, avatar: null }));

      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: null }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
      } else {
        alert(data.message || "Failed to remove avatar");
      }
    } catch (err) {
      console.error("🔥 [handleRemoveImage Error]:", err);
    }
  };

  // 🔹 Save edited profile
  const handleSave = async (e) => {
    e.preventDefault();
    if (loading) return;

    // ✅ Check if name is empty
    if (!formData.username.trim()) {
      alert("⚠️ Name is required before saving!");
      return;
    }

    setLoading(true);

    try {
      const body = {
        username: formData.username,
        age: formData.age,
        location: formData.location,
        about: formData.about,
        designation: formData.designation,
      };

      if (preview === null) {
        body.avatar = null;
      } else if (formData.avatar?.startsWith("data:")) {
        body.avatar = { base64: formData.avatar };
      }

      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setEditing(false);
        alert("✅ Profile updated successfully!");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("🔥 [handleSave Error]:", err);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cancel editing
  const handleCancel = () => {
    setFormData({
      username: user.username || "",
      age: user.age || "",
      location: user.location || "",
      about: user.about || "",
      designation: user.designation || "",
      avatar: user.avatar?.url || null,
    });
    setPreview(user.avatar?.url || null);
    setEditing(false);
  };

  if (!user)
    return <p className="text-center mt-10 text-gray-300">Loading profile...</p>;

  return (
    <div className="w-full flex justify-center mt-10 px-4">
      <div className="w-full max-w-4xl bg-gray-800 text-white rounded-2xl shadow-lg p-10 border border-gray-700">
        <h1 className="text-4xl font-bold text-center mb-10">
          {editing ? "Edit Profile" : "User Profile"}
        </h1>

        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-gray-600"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-green-600 flex items-center justify-center text-5xl font-bold uppercase">
                {formData.username?.charAt(0) || "U"}
              </div>
            )}

            {editing && (
              <div className="flex flex-col items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-gray-300"
                />
                {preview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!editing}
              required={editing} // ✅ name required only in editing mode
              className={`w-full p-3 rounded-md text-white bg-gray-700 ${
                editing
                  ? "border border-gray-500 focus:border-green-500"
                  : "border-none"
              }`}
            />
          </div>

          {/* Email (non-editable) */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full p-3 rounded-md bg-gray-700 text-gray-400 border-none cursor-not-allowed"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full p-3 rounded-md text-white bg-gray-700 ${
                editing
                  ? "border border-gray-500 focus:border-green-500"
                  : "border-none"
              }`}
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Age</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full p-3 rounded-md text-white bg-gray-700 ${
                editing
                  ? "border border-gray-500 focus:border-green-500"
                  : "border-none"
              }`}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full p-3 rounded-md text-white bg-gray-700 ${
                editing
                  ? "border border-gray-500 focus:border-green-500"
                  : "border-none"
              }`}
            />
          </div>

          {/* About */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full p-3 rounded-md text-white bg-gray-700 h-32 ${
                editing
                  ? "border border-gray-500 focus:border-green-500"
                  : "border-none"
              }`}
              placeholder="Write about yourself..."
            />
          </div>

          <p className="text-sm text-gray-400 text-right">
            Joined on: {new Date(user.createdAt).toLocaleDateString()}
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-6 mt-8">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 px-8 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="bg-gray-600 hover:bg-gray-700 px-8 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-md font-medium"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}











