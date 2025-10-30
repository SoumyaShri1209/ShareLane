




"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const initialState = {
  title: "",
  description: "",
  excerpt: "",
  quote: "",
  photo: null,
};

export default function CreateBlog() {
  const CLOUD_NAME = "ds1pryqt0";
  const UPLOAD_PRESET = "Blog_App";

  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  // ✅ Debug: log session on each render
  console.log("Session data:", session);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Access denied");
      router.push("/login");
    }
  }, [status, router]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setState({ ...state, [name]: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const uploadImage = async () => {
    if (!state.photo) return null;

    const formData = new FormData();
    formData.append("file", state.photo);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      console.log("Image upload response:", data); // ✅ debug
      if (!data.secure_url) throw new Error("Image upload failed");
      return { id: data.public_id, url: data.secure_url };
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Image upload failed!");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, excerpt, quote, photo } = state;

    if (!title || !description || !excerpt || !photo) {
      toast.error("All fields including image are required.", { duration: 7000 });
      return;
    }

    if (photo.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Max 5MB.", { duration: 7000 });
      return;
    }

    try {
      setIsLoading(true);
      const image = await uploadImage();
      if (!image) return;

      const newBlog = {
        title,
        description,
        excerpt,
        quote,
        image,
        authorId: session?.user?.id,
      };

      // ✅ Debug: log what we are sending to API
      console.log("Sending blog to API:", newBlog);
      console.log("Access Token:", session?.user?.accessToken);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(newBlog),
      });

      const data = await response.json();
      console.log("API response:", data); // ✅ debug

      if (!response.ok) {
        toast.error(`Error: ${data?.error || "Something went wrong"}`);
        return;
      }

      toast.success("Blog created successfully!");
      setState(initialState);
      router.push("/posts");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container max-w-3xl mx-auto py-10">
      <h2 className="mb-5 text-3xl font-bold text-white">
        <span className="text-green-500">Create </span>Blog
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="title"
          value={state.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-500 text-white"
        />
        <textarea
          name="description"
          value={state.description}
          onChange={handleChange}
          placeholder="Description"
          rows={5}
          className="w-full p-2 rounded bg-gray-500 text-white"
        />
        <textarea
          name="excerpt"
          value={state.excerpt}
          onChange={handleChange}
          placeholder="Excerpt"
          rows={3}
          className="w-full p-2 rounded bg-gray-500 text-white"
        />
    
        <input type="file" name="photo" accept="image/*" onChange={handleChange} />
        {state.photo && (
          <Image src={URL.createObjectURL(state.photo)} width={200} height={200} alt="Preview" />
        )}
        <button type="submit" disabled={isLoading} className="bg-green-700 text-white px-6 py-2 rounded">
          {isLoading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </section>
  );
}
