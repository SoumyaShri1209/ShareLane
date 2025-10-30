

import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

export async function POST(req, { params }) {
  try {
    await connect();

    const { id } = await params;

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const blog = await Blog.findById(id);
    if (!blog)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const liked = blog.likes.includes(user._id);
    if (liked) {
      blog.likes.pull(user._id);
    } else {
      blog.likes.push(user._id);
    }

    await blog.save();

    return NextResponse.json({ liked: !liked }, { status: 200 });
  } catch (err) {
    console.error("LIKE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
