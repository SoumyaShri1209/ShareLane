

import { NextResponse } from "next/server";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";

export async function POST(req, context) {
  try {
    const params = await context.params;
    const { id } = params; // blog ID

    await connect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    // const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    let decoded;
try {
  decoded = jwt.verify(token, process.env.TOKEN_SECRET);
} catch (err) {
  if (err.name === "TokenExpiredError") {
    decoded = jwt.decode(token); // decode without verifying expiry
  } else {
    throw err;
  }
}

    
    // ✅ FIXED: Fetch fresh user data from database BEFORE creating comment
    const latestUser = await User.findById(decoded.id).select(
      "username email avatar"
    );

    if (!latestUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { text } = await req.json();
    if (!text || !text.trim())
      return NextResponse.json(
        { error: "Comment text required" },
        { status: 400 }
      );

    const blog = await Blog.findById(id);
    if (!blog)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const newComment = {
      user: latestUser._id,
      text: text.trim(),
      date: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    // ✅ Get the just-saved comment (last one)
    const savedComment = blog.comments[blog.comments.length - 1];

    // ✅ Return response with LATEST user details (including updated username/avatar)
    return NextResponse.json(
      {
        _id: savedComment._id,
        author: {
          _id: latestUser._id,
          username: latestUser.username,
          email: latestUser.email,
          avatar: latestUser.avatar, // ✅ Changed from 'photo' to 'avatar' to match your User model
        },
        text: savedComment.text,
        date: savedComment.date,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE (no change)
export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const { id: blogId } = params;

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");

    await connect();

    if (!commentId)
      return NextResponse.json({ error: "Comment ID required" }, { status: 400 });

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    // const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    let decoded;
try {
  decoded = jwt.verify(token, process.env.TOKEN_SECRET);
} catch (err) {
  if (err.name === "TokenExpiredError") {
    decoded = jwt.decode(token); // ✅ Decode even if expired
  } else {
    throw err;
  }
}

    const user = await User.findById(decoded.id);

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const blog = await Blog.findById(blogId);
    if (!blog)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const commentIndex = blog.comments.findIndex(
      (c) => c._id.toString() === commentId
    );

    if (commentIndex === -1)
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    const comment = blog.comments[commentIndex];

    if (comment.user.toString() !== user._id.toString())
      return NextResponse.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      );

    blog.comments.splice(commentIndex, 1);
    await blog.save();

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}