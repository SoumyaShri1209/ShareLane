
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AiTwotoneCalendar } from 'react-icons/ai';
import moment from 'moment';

const OtherBlogs = ({ otherBlogs }) => {
  const demoImage = "/profile.jpg";

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {otherBlogs?.length > 0 &&
          otherBlogs.map((item, index) => {
            const timeStr = item?.createdAt;
            const formattedTime = timeStr ? moment(timeStr).format("MMMM Do YYYY") : "";

            return (
              <div key={item?._id || index} className="flex flex-col gap-3">
                <Link href={`/blog/${item?._id}`}>
                  <div className="cursor-pointer">
                    <Image
                      src={item?.image?.url || demoImage}
                      alt={item?.title || "Blog Image"}
                      width={600}
                      height={400}
                      sizes="100vw"
                      className="w-full h-full rounded-lg object-cover mb-2"
                    />
                    <div className='space-y-2'>
                          <div className="flex items-center gap-3 text-xs">
                                      <p className="flex items-center gap-1 text-gray-400">
                                        <AiTwotoneCalendar />
                                        {formattedTime}
                                      </p>
                                    </div>
                                  <div className="space-y-2">
              <h2 className="text-lg font-semibold">{item?.title || "Untitled Blog"}</h2>
              <p className="text-sm text-gray-400">{item?.excerpt || ""}</p>
            </div>


                   <div className="flex items-center gap-3">
                          <Image
                            src={item?.authorId?.avatar?.url || demoImage}
                            alt={item?.authorId?.username || "Author"}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
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

            
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default OtherBlogs;
