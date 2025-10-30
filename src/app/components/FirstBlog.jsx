
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AiTwotoneCalendar } from 'react-icons/ai';
import moment from 'moment';

const FirstBlog = ({ firstBlog }) => {
  console.log("Author Name:", firstBlog?.authorId?.username);
  console.log("First Blog Object:", firstBlog);

  const timeStr = firstBlog?.createdAt;
  const formattedTime = timeStr ? moment(timeStr).format("MMMM Do YYYY") : "";

  const demoImage = "/profile.jpg";

  return (
    <section>
      <Link href={`/blog/${firstBlog?._id}`}>
        <div className="flex flex-col md:flex-row items-center gap-8 ">
          
          {/* Blog Image */}
          <div className="w-full lg:w-2/5">
            <Image
              src={firstBlog?.image?.url || demoImage}
              alt={firstBlog?.title || "Blog Image"}
              width={600}
              height={400}
              sizes="100vw"
              className="w-full h-full rounded-lg object-cover"
            />
          </div>

          {/* Blog Info */}
          <div className="w-full lg:w-3/5 space-y-5">

            {/* Date */}
            <div className="flex items-center gap-3 text-xs">
              <p className="flex items-center gap-1 text-gray-400">
                <AiTwotoneCalendar />
                {formattedTime}
              </p>
            </div>

            {/* Title & Excerpt */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{firstBlog?.title || "Untitled Blog"}</h2>
              <p className="text-sm text-gray-400">{firstBlog?.excerpt || ""}</p>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3">
              <Image
                src={firstBlog?.authorId?.avatar?.url || demoImage}
                alt={firstBlog?.authorId?.username || "Author"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
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
  );
};

export default FirstBlog;
