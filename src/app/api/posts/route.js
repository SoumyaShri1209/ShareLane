




import Blog from "@/models/blogModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/dbConfig/jwt";

export async function POST(req) {
  await connect();

  const accessToken = req.headers.get("authorization");
  if (!accessToken) {
    return NextResponse.json({ error: "Authorization header missing" }, { status: 403 });
  }

  const token = accessToken.split(" ")[1];
  const decodedToken = verifyJwtToken(token);
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized (invalid or expired token)" }, { status: 403 });
  }

  try {
    const body = await req.json();

    // ✅ Make sure image is provided
    if (!body.image || !body.image.url) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // ✅ Set authorId from JWT
    const newBlogData = { ...body, authorId: decodedToken.id };

    const newBlog = await Blog.create(newBlogData);
    console.log("✅ New blog saved:", newBlog);

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ message: "POST error", error: error.message }, { status: 500 });
  }
}




export async function GET(req){
  await connect();

  try {
    const blogs = await Blog.find({}).populate({
      path: "authorId",
      select: "-password"
    }).sort({createdAt : -1});

    return NextResponse.json(blogs);
    
  } catch (error) {
     return NextResponse.json({ message: "GET error", error: error.message }, { status: 500 });
  }
  
}


