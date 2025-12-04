
import { NextResponse } from "next/server";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { corsHeaders } from '@/middleware/cors';
import { verifyJwtToken } from '@/dbConfig/jwt';

export async function GET(req, context) {
  await connect();

  try {
    // 🔎 Await params (Next.js requirement)
    const { id } = await context.params;
    console.log("=== 📩 GET /api/posts/[id] - Blog ID:", id);

    // ✅ Fetch blog and populate authorId with avatar (not photo)
    const blog = await Blog.findById(id)
      .populate("authorId", "username email avatar designation")
      .lean(); // Use lean() for better performance

    if (!blog) {
      console.log("❌ Blog not found for id:", id);
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    console.log("✅ Blog found:", blog.title);
    console.log("✅ Author:", blog.authorId?.username);
    console.log("✅ Author avatar:", blog.authorId?.avatar);

    // ✅ CRITICAL FIX: Manually populate comments with fresh user data including avatar
    if (blog.comments && blog.comments.length > 0) {
      console.log(`🔄 Processing ${blog.comments.length} comments...`);
      
      for (let i = 0; i < blog.comments.length; i++) {
        const comment = blog.comments[i];
        
        if (comment.user) {
          // ✅ Fetch fresh user data with avatar field
          const userData = await User.findById(comment.user)
            .select("username email avatar")
            .lean();
          
          if (userData) {
            console.log(`✅ Comment[${i}] populated:`, {
              username: userData.username,
              avatar: userData.avatar?.url || 'no avatar'
            });
            
            // ✅ Replace user ID with full user object
            blog.comments[i].user = {
              _id: userData._id,
              username: userData.username,
              email: userData.email,
              avatar: userData.avatar, // This contains {url, publicId}
            };
          } else {
            console.warn(`⚠️ Comment[${i}] user not found`);
          }
        }
      }
      
      console.log("✅ All comments populated successfully");
    }

    return NextResponse.json(blog, { status: 200 , headers: corsHeaders()  });
  } catch (err) {
    console.error("❌ GET blog error:", err);
    return NextResponse.json(
      { message: "Error fetching blog", error: err.message },
      { status: 500 }
    );
  }
}

// Keep your other methods (POST, PUT, DELETE) below this if you have them

export async function DELETE(req, context) {
  await connect();

  try {
    const { id } = await context.params;

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header missing" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJwtToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized (invalid or expired token)" }, { status: 403 });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Only the author can delete their blog
    if (String(blog.authorId) !== String(decoded.id)) {
      return NextResponse.json({ error: "You are not authorized to delete this blog" }, { status: 403 });
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200, headers: corsHeaders() });
  } catch (err) {
    console.error("DELETE /api/posts/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}