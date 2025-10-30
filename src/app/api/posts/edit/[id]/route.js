


import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Blog from "@/models/blogModel";
import { verifyJwtToken } from "@/dbConfig/jwt";
import { v2 as cloudinary } from "cloudinary"; // use v2


// Configure Cloudinary correctly
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: { bodyParser: false }, // required for form data
};

// PUT /api/posts/edit/[id]
export async function PUT(req, context) {
  const { params } =  context; // await params for app router dynamic API
  const { id } = params;

  console.log("🟢 PUT request received for blog ID:", id);

  await connect();

  try {
    // Check Authorization token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "No token" }, { status: 401 });

    const decoded = verifyJwtToken(token);
    if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 403 });

    // Fetch blog from DB
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    if (blog.authorId.toString() !== decoded.id)
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    console.log("📦 Blog fetched from DB:", blog);

    // Parse FormData (works in Next.js app router)
    const formData = await req.formData();
    const title = formData.get("title");
    const excerpt = formData.get("excerpt");
    const description = formData.get("description");
    const imageFile = formData.get("image");

    // Update text fields
    if (title) blog.title = title;
    if (excerpt) blog.excerpt = excerpt;
    if (description) blog.description = description;

    // Update image if uploaded
    if (imageFile && imageFile.size > 0) {
      // Delete old image in Cloudinary
      if (blog.image?.id) {
        await cloudinary.uploader.destroy(blog.image.id);
        console.log("Old image deleted:", blog.image.id);
      }

      // Upload new image directly from blob
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploaded = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "blogs" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      blog.image = { id: uploaded.public_id, url: uploaded.secure_url };
      console.log("New image uploaded:", uploaded.secure_url);
    }

    await blog.save();
    console.log("✅ Blog updated successfully:", blog._id);

    return NextResponse.json({ message: "Blog updated", blog }, { status: 200 });
  } catch (err) {
    console.error("❌ PUT Error:", err);
    return NextResponse.json({ message: "Error updating blog", error: err.message }, { status: 500 });
  }
}
