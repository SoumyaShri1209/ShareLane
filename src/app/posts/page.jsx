



"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiTwotoneCalendar } from "react-icons/ai";
import moment from "moment";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("http://localhost:3000/api/posts", {
          cache: "no-store", // ✅ ensures fresh data every time
        });
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    }

    fetchBlogs();
  }, []);

  if (!blogs || blogs.length === 0) {
    return (
      <h3 className="text-center mt-10 text-gray-500 text-xl">No Blogs...</h3>
    );
  }

  const firstBlog = blogs[0];
  const otherBlogs = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-center my-10 text-3xl font-bold">
        <span className="text-green-600">Trending</span> Blog
      </h2>

      {/* -------------------- FIRST BLOG -------------------- */}
      <section className="mb-16">
        <Link href={`/posts/${firstBlog?._id}`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Blog Image */}
            <div className="w-full lg:w-2/5">
              {firstBlog?.image?.url && (
                <Image
                  src={`${firstBlog.image.url}?t=${Date.now()}`}
                  alt={firstBlog?.title || "Blog Image"}
                  width={600}
                  height={400}
                  sizes="100vw"
                  className="w-full h-full rounded-lg object-cover"
                />
              )}
            </div>

            {/* Blog Info */}
            <div className="w-full lg:w-3/5 space-y-5">
              <div className="flex items-center gap-3 text-xs">
                <p className="flex items-center gap-1 text-gray-400">
                  <AiTwotoneCalendar />
                  {moment(firstBlog?.createdAt).format("MMMM Do YYYY")}
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                  {firstBlog?.title || "Untitled Blog"}
                </h2>
                <p className="text-sm text-gray-400">
                  {firstBlog?.excerpt || ""}
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                {firstBlog?.authorId?.avatar?.url ? (
                  <Image
                    src={`${firstBlog.authorId.avatar.url}?t=${Date.now()}`}
                    alt={firstBlog?.authorId?.username || "Author"}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-lg">
                    {firstBlog?.authorId?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="text-xs">
                  <h6>{firstBlog?.authorId?.username || "Unknown Author"}</h6>
                  <p className="text-gray-400">
                    {firstBlog?.authorId?.designation || "No designation"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* -------------------- OTHER BLOGS -------------------- */}
      {otherBlogs.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {otherBlogs.map((item, index) => (
              <Link key={item?._id || index} href={`/posts/${item?._id}`}>
                <div className="cursor-pointer flex flex-col gap-3">
                  {/* Blog Image */}
                  {item?.image?.url && (
                    <Image
                      src={`${item.image.url}?t=${Date.now()}`}
                      alt={item?.title || "Blog Image"}
                      width={600}
                      height={400}
                      sizes="100vw"
                      className="w-full h-full rounded-lg object-cover mb-2"
                    />
                  )}

                  {/* Blog Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs">
                      <p className="flex items-center gap-1 text-gray-400">
                        <AiTwotoneCalendar />
                        {moment(item?.createdAt).format("MMMM Do YYYY")}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold">
                        {item?.title || "Untitled Blog"}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {item?.excerpt || ""}
                      </p>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                      {item?.authorId?.avatar?.url ? (
                        <Image
                          src={`${item.authorId.avatar.url}?t=${Date.now()}`}
                          alt={item?.authorId?.username || "Author"}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-lg">
                          {item?.authorId?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="text-xs">
                        <h6>{item?.authorId?.username || "Unknown Author"}</h6>
                        <p className="text-gray-400">
                          {item?.authorId?.designation || "No designation"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPage;
