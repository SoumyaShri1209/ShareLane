



// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import { useRouter, useParams } from "next/navigation";
// import moment from "moment";
// import {
//   AiFillHeart,
//   AiOutlineComment,
//   AiOutlineHeart,
//   AiTwotoneCalendar,
// } from "react-icons/ai";
// import { BsFillPencilFill, BsTrash } from "react-icons/bs";

// export default function BlogDetailPage() {
//   const { id: blogId } = useParams();
//   const router = useRouter();
//   const { data: session } = useSession();
//   const demoImage = "/profile.jpg";

//   const [blogDetails, setBlogDetails] = useState(null);
//   const [comment, setComment] = useState("");
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch blog details
//   useEffect(() => {
//     async function fetchBlog() {
//       try {
//         const res = await fetch(`/api/posts/${blogId}`);
//         if (!res.ok) throw new Error("Failed to fetch blog");
//         const blog = await res.json();
//         console.log("📦 Blog data received:", posts);
//         setBlogDetails(posts);
//         setComments(posts.comments || []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (blogId) fetchBlog();
//   }, [blogId]);

//   if (loading)
//     return <p className="text-center text-gray-400 py-10">Loading blog...</p>;
//   if (error)
//     return <p className="text-center text-red-500 py-10">Error: {error}</p>;
//   if (!blogDetails)
//     return <p className="text-center text-gray-400 py-10">No blog found!</p>;

//   const userId = session?.user?.id || session?.user?._id;
//   const authorId = blogDetails?.authorId?._id;
//   const isAuthor = userId && authorId && String(userId) === String(authorId);

//   // ✅ Determine Author Profile Image or Letter (using avatar, not photo)
//   const authorImage = blogDetails.authorId?.avatar?.url;
//   const authorName = blogDetails.authorId?.username || "User";
//   const showLetterFallback = !authorImage;

//   // Delete blog
//   const handleDelete = async () => {
//     if (!confirm("Are you sure you want to delete this blog?")) return;
//     try {
//       const res = await fetch(`/api/posts/${blogId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${session.user.accessToken}` },
//       });
//       if (!res.ok) throw new Error("Failed to delete blog");
//       alert("Blog deleted successfully!");
//       router.push("/posts");
//     } catch (err) {
//       alert("Error deleting blog: " + err.message);
//     }
//   };

//   // Delete comment
//   const handleCommentDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this comment?")) return;
//     try {
//       const res = await fetch(`/api/posts/${blogId}/comment?commentId=${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${session.user.accessToken}` },
//       });
//       if (!res.ok) throw new Error("Failed to delete comment");
//       setComments((prev) => prev.filter((c) => c._id !== id));
//     } catch (err) {
//       alert("Error deleting comment: " + err.message);
//     }
//   };

//   // ✅ Add comment using fresh data from API response
//   const handleAddComment = async (e) => {
//     e.preventDefault();
//     if (!comment.trim()) return;

//     try {
//       const res = await fetch(`/api/posts/${blogId}/comment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session.user.accessToken}`,
//         },
//         body: JSON.stringify({ text: comment }),
//       });

//       if (!res.ok) throw new Error("Failed to post comment");

//       const newComment = await res.json();
      
//       console.log("✅ New comment from API:", newComment);
      
//       setComments((prev) => [...prev, newComment]);
//       setComment("");
//     } catch (err) {
//       alert("Error adding comment: " + err.message);
//     }
//   };

//   // Toggle Like
//   const handleLikeToggle = async () => {
//     if (!session) {
//       alert("Please login to like this post");
//       return;
//     }

//     try {
//       const res = await fetch(`/api/posts/${blogId}/like`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${session.user.accessToken}` },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to toggle like");

//       setBlogDetails((prev) => ({
//         ...prev,
//         likes: data.liked
//           ? [...(prev.likes || []), userId]
//           : prev.likes.filter((id) => id !== userId),
//       }));
//     } catch (err) {
//       alert("Error: " + err.message);
//     }
//   };

//   const hasLiked = blogDetails.likes?.includes(userId);

//   return (
//     <div className="container max-w-4xl mx-auto py-10 text-white">

//       {/* Edit/Delete Buttons */}
//       {isAuthor && (
//         <div className="flex items-center justify-end gap-5 mb-5">
//           <Link
//             href={`/posts/edit/${blogId}`}
//             className="flex items-center gap-1 text-green-500"
//           >
//             <BsFillPencilFill /> Edit
//           </Link>
//           <button
//             onClick={handleDelete}
//             className="flex items-center gap-1 text-red-500"
//           >
//             <BsTrash /> Delete
//           </button>
//         </div>
//       )}

//       {/* ✅ Blog Author */}
//       <div className="flex flex-col items-center py-5">
//         <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-gray-700 text-white text-3xl font-bold">
//           {showLetterFallback ? (
//             <span>{authorName.charAt(0).toUpperCase()}</span>
//           ) : (
//             <Image
//               src={authorImage}
//               alt="avatar"
//               width={80}
//               height={80}
//               className="object-cover"
//             />
//           )}
//         </div>
//         <div className="text-center mt-2">
//           <p className="text-white font-semibold">{authorName}</p>
//           <p className="text-gray-400 text-sm">
//             {blogDetails.authorId?.designation || "Blogger"}
//           </p>
//         </div>
//       </div>

//       {/* ✅ Blog Content */}
//       <div className="text-center space-y-5">
//         <h2 className="text-3xl font-bold">{blogDetails.title}</h2>
//         <p>{blogDetails.excerpt}</p>
//         <p className="flex items-center justify-center gap-2">
//           <AiTwotoneCalendar />{" "}
//           {moment(blogDetails.createdAt).format("MMM D, YYYY")}
//         </p>
//         <div className="py-5">
//           <Image
//             src={
//               blogDetails.image?.url && blogDetails.image.url.trim() !== ""
//                 ? blogDetails.image.url
//                 : demoImage
//             }
//             alt="blog image"
//             width={800}
//             height={400}
//             className="w-full h-full rounded-lg"
//           />
//         </div>
//         <p className="text-left">{blogDetails.description}</p>
//       </div>

//       {/* Likes & Comments */}
//       <div className="py-10 flex gap-10 items-center justify-center text-xl">
//         <div
//           onClick={handleLikeToggle}
//           className="flex items-center gap-1 cursor-pointer select-none"
//         >
//           <p>{blogDetails.likes?.length || 0}</p>
//           {hasLiked ? (
//             <AiFillHeart
//               size={25}
//               color="red"
//               className="transition-transform duration-200 hover:scale-125"
//             />
//           ) : (
//             <AiOutlineHeart
//               size={25}
//               className="transition-transform duration-200 hover:scale-125"
//             />
//           )}
//         </div>

//         <div className="flex items-center gap-1">
//           <p>{comments.length}</p>
//           <AiOutlineComment size={22} />
//         </div>
//       </div>

//       {/* Comment Form */}
//       <div className="mb-5">
//         {!session ? (
//           <p className="text-red-500 text-center">
//             Kindly login to leave a comment.
//           </p>
//         ) : (
//           <form className="space-y-2" onSubmit={handleAddComment}>
//             <input
//               type="text"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Type a message..."
//               className="w-full p-2 rounded bg-gray-700 text-white"
//             />
//             <button
//               type="submit"
//               className="bg-green-600 p-3 rounded-xl text-white w-full"
//             >
//               Comment
//             </button>
//           </form>
//         )}
//       </div>

//       {/* ✅ FIXED: Comments List */}
//       <div className="space-y-5">
//         {comments.map((c) => {
//           // ✅ Handle both new comments (with author) and existing comments (with user)
//           const commentAuthorName = c.author?.username || c.user?.username || "Unknown";
//           const commentAuthorId = c.author?._id || c.user?._id || c.user;
//           const commentAuthorAvatar = c.author?.avatar?.url || c.user?.avatar?.url || null;

//           console.log("🔍 Rendering comment:", {
//             name: commentAuthorName,
//             avatar: commentAuthorAvatar,
//             hasAuthor: !!c.author,
//             hasUser: !!c.user
//           });

//           return (
//             <div
//               key={c._id}
//               className="flex gap-3 items-center border-b border-gray-700 pb-3"
//             >
//               {/* ✅ Display avatar or first letter */}
//               <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-green-600 text-white text-xl font-bold">
//                 {commentAuthorAvatar ? (
//                   <Image
//                     src={commentAuthorAvatar}
//                     alt="avatar"
//                     width={40}
//                     height={40}
//                     className="object-cover"
//                   />
//                 ) : (
//                   <span>{commentAuthorName.charAt(0).toUpperCase()}</span>
//                 )}
//               </div>
              
//               <div className="flex-1">
//                 <div className="flex items-center justify-between">
//                   <p className="text-white font-semibold">
//                     {commentAuthorName}
//                   </p>
//                   <p className="text-gray-400 text-sm">
//                     {moment(c.date).fromNow()}
//                   </p>
//                 </div>
//                 <p className="text-gray-200">{c.text}</p>
//               </div>
              
//               {/* Delete button - only show for comment author */}
//               {userId && commentAuthorId && String(userId) === String(commentAuthorId) && (
//                 <BsTrash
//                   onClick={() => handleCommentDelete(c._id)}
//                   className="text-red-500 cursor-pointer"
//                 />
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }














"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import moment from "moment";
import {
  AiFillHeart,
  AiOutlineComment,
  AiOutlineHeart,
  AiTwotoneCalendar,
} from "react-icons/ai";
import { BsFillPencilFill, BsTrash } from "react-icons/bs";

export default function BlogDetailPage() {
  const { id: blogId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const demoImage = "/profile.jpg";

  const [blogDetails, setBlogDetails] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blog details
  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/posts/${blogId}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const blog = await res.json();
        console.log("📦 Blog data received:", blog);
        setBlogDetails(blog);
        setComments(blog.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (blogId) fetchBlog();
  }, [blogId]);

  if (loading)
    return <p className="text-center text-gray-400 py-10">Loading blog...</p>;
  if (error)
    return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  if (!blogDetails)
    return <p className="text-center text-gray-400 py-10">No blog found!</p>;

  const userId = session?.user?.id || session?.user?._id;
  const authorId = blogDetails?.authorId?._id;
  const isAuthor = userId && authorId && String(userId) === String(authorId);

  // ✅ Determine Author Profile Image or Letter (using avatar, not photo)
  const authorImage = blogDetails.authorId?.avatar?.url;
  const authorName = blogDetails.authorId?.username || "User";
  const showLetterFallback = !authorImage;

  // Delete blog
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`/api/posts/${blogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      alert("Blog deleted successfully!");
      router.push("/posts");
    } catch (err) {
      alert("Error deleting blog: " + err.message);
    }
  };

  // Delete comment
  const handleCommentDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`/api/posts/${blogId}/comment?commentId=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete comment");
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Error deleting comment: " + err.message);
    }
  };

  // ✅ Add comment using fresh data from API response
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const res = await fetch(`/api/posts/${blogId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ text: comment }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const newComment = await res.json();
      
      console.log("✅ New comment from API:", newComment);
      
      setComments((prev) => [...prev, newComment]);
      setComment("");
    } catch (err) {
      alert("Error adding comment: " + err.message);
    }
  };

  // Toggle Like
  const handleLikeToggle = async () => {
    if (!session) {
      alert("Please login to like this post");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${blogId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle like");

      setBlogDetails((prev) => ({
        ...prev,
        likes: data.liked
          ? [...(prev.likes || []), userId]
          : prev.likes.filter((id) => id !== userId),
      }));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const hasLiked = blogDetails.likes?.includes(userId);

  return (
    <div className="container max-w-4xl mx-auto py-10 text-white">

      {/* Edit/Delete Buttons */}
      {isAuthor && (
        <div className="flex items-center justify-end gap-5 mb-5">
          <Link
            href={`/posts/edit/${blogId}`}
            className="flex items-center gap-1 text-green-500"
          >
            <BsFillPencilFill /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-red-500"
          >
            <BsTrash /> Delete
          </button>
        </div>
      )}

      {/* ✅ Blog Author */}
      <div className="flex flex-col items-center py-5">
        <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-gray-700 text-white text-3xl font-bold">
          {showLetterFallback ? (
            <span>{authorName.charAt(0).toUpperCase()}</span>
          ) : (
            <Image
              src={authorImage}
              alt="avatar"
              width={80}
              height={80}
              className="object-cover"
            />
          )}
        </div>
        <div className="text-center mt-2">
          <p className="text-white font-semibold">{authorName}</p>
          <p className="text-gray-400 text-sm">
            {blogDetails.authorId?.designation || "Blogger"}
          </p>
        </div>
      </div>

      {/* ✅ Blog Content */}
      <div className="text-center space-y-5">
        <h2 className="text-3xl font-bold">{blogDetails.title}</h2>
        <p>{blogDetails.excerpt}</p>
        <p className="flex items-center justify-center gap-2">
          <AiTwotoneCalendar />{" "}
          {moment(blogDetails.createdAt).format("MMM D, YYYY")}
        </p>
        <div className="py-5">
          <Image
            src={
              blogDetails.image?.url && blogDetails.image.url.trim() !== ""
                ? blogDetails.image.url
                : demoImage
            }
            alt="blog image"
            width={800}
            height={400}
            className="w-full h-full rounded-lg"
          />
        </div>
        <p className="text-left">{blogDetails.description}</p>
      </div>

      {/* Likes & Comments */}
      <div className="py-10 flex gap-10 items-center justify-center text-xl">
        <div
          onClick={handleLikeToggle}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          <p>{blogDetails.likes?.length || 0}</p>
          {hasLiked ? (
            <AiFillHeart
              size={25}
              color="red"
              className="transition-transform duration-200 hover:scale-125"
            />
          ) : (
            <AiOutlineHeart
              size={25}
              className="transition-transform duration-200 hover:scale-125"
            />
          )}
        </div>

        <div className="flex items-center gap-1">
          <p>{comments.length}</p>
          <AiOutlineComment size={22} />
        </div>
      </div>

      {/* Comment Form */}
      <div className="mb-5">
        {!session ? (
          <p className="text-red-500 text-center">
            Kindly login to leave a comment.
          </p>
        ) : (
          <form className="space-y-2" onSubmit={handleAddComment}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Type a message..."
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <button
              type="submit"
              className="bg-green-600 p-3 rounded-xl text-white w-full"
            >
              Comment
            </button>
          </form>
        )}
      </div>

      {/* ✅ FIXED: Comments List */}
      <div className="space-y-5">
        {comments.map((c) => {
          // ✅ Handle both new comments (with author) and existing comments (with user)
          const commentAuthorName = c.author?.username || c.user?.username || "Unknown";
          const commentAuthorId = c.author?._id || c.user?._id || c.user;
          const commentAuthorAvatar = c.author?.avatar?.url || c.user?.avatar?.url || null;

          console.log("🔍 Rendering comment:", {
            name: commentAuthorName,
            avatar: commentAuthorAvatar,
            hasAuthor: !!c.author,
            hasUser: !!c.user
          });

          return (
            <div
              key={c._id}
              className="flex gap-3 items-center border-b border-gray-700 pb-3"
            >
              {/* ✅ Display avatar or first letter */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-green-600 text-white text-xl font-bold">
                {commentAuthorAvatar ? (
                  <Image
                    src={commentAuthorAvatar}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <span>{commentAuthorName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-white font-semibold">
                    {commentAuthorName}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {moment(c.date).fromNow()}
                  </p>
                </div>
                <p className="text-gray-200">{c.text}</p>
              </div>
              
              {/* Delete button - only show for comment author */}
              {userId && commentAuthorId && String(userId) === String(commentAuthorId) && (
                <BsTrash
                  onClick={() => handleCommentDelete(c._id)}
                  className="text-red-500 cursor-pointer"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}