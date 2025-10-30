
import { NextResponse } from "next/server";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { corsHeaders } from '@/middleware/cors';

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