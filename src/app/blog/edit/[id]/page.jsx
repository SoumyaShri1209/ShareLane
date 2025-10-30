


"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

const EditBlogPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState({ title: "", excerpt: "", description: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || status === "loading") return;

    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${id}`);
        setForm({
          title: res.data.title,
          excerpt: res.data.excerpt,
          description: res.data.description,
        });
        setPreview(res.data.image?.url || "");
      } catch (err) {
        console.error("❌ Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, status]); // only run once per blog ID

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("excerpt", form.excerpt);
    formData.append("description", form.description);
    if (image) formData.append("image", image);

    try {
      const res = await axios.put(`/api/blog/edit/${id}`, formData, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      });

      if (res.status === 200) {
        toast.success("Blog updated!");
        router.push(`/blog/${id}`);
      } else {
        toast.error(res.data.message || "Failed to update blog");
      }
    } catch (err) {

      toast.error("Something went wrong");
    }
  };

  if (loading) return <p className="text-center text-gray-400 py-10">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto py-14 px-8">
      <h2 className="text-4xl font-bold mb-8 text-center text-white">✏️ Edit Blog</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-900 p-10 rounded-2xl shadow-lg border border-gray-700"
      >
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter title"
          required
          className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
        />

        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Enter excerpt"
          rows="4"
          required
          className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Write your blog content..."
          rows="8"
          required
          className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <div className="mt-4 flex justify-center">
            <Image
              src={preview}
              alt="Blog Preview"
              width={800}
              height={400}
              className="rounded-lg border border-gray-700 shadow-md"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition duration-200"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlogPage;
