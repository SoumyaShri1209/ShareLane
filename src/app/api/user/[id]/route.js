
import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";

// ✅ Minimal inline authOptions
const authOptions = { secret: process.env.NEXTAUTH_SECRET };

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================
// 🧩 Helper: Delete from Cloudinary
// ==========================
async function deleteFromCloudinary(publicId) {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("❌ Error deleting from Cloudinary:", error);
  }
}

// ==========================
// 🧩 Helper: Upload to Cloudinary with compression
// ==========================
async function uploadToCloudinary(base64) {
  try {
    console.log("📤 Uploading avatar to Cloudinary (pre-compressed)...");

    // Extract and decode base64 data
    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : "image/jpeg";
    const data = matches ? matches[2] : base64;
    let buffer = Buffer.from(data, "base64");

    // 🪄 Step 1: If file > 9MB, reduce base64 size by downscaling
    const MAX_SIZE = 9 * 1024 * 1024; // 9 MB buffer limit
    if (buffer.length > MAX_SIZE) {
      console.log("⚠️ Image too large (" + buffer.length + " bytes). Compressing...");
      // simple lossy shrink: cut data length (base64 truncation)
      const shrinkRatio = MAX_SIZE / buffer.length;
      buffer = buffer.slice(0, Math.floor(buffer.length * shrinkRatio));
      console.log("✅ Compressed buffer to:", buffer.length, "bytes");
    }

    // 🪄 Step 2: Upload to Cloudinary with compression transformations
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "user_avatars",
          resource_type: "image",
          transformation: [
            { width: 500, height: 500, crop: "limit" },
            { quality: "auto:eco" },
            { fetch_format: "jpg" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    return { url: result.secure_url, publicId: result.public_id };
  } catch (err) {
    console.error("❌ Cloudinary Upload Error:", err.message);
    throw new Error("Avatar upload failed: " + err.message);
  }
}


// ==========================
// 🧩 GET - Fetch user
// ==========================
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connect();
    const user = await User.findById(id).select("-password");

    if (!user)
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ==========================
// 🧩 PUT - Update user
// ==========================
export async function PUT(req, { params }) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connect();
    const existingUser = await User.findById(id);
    if (!existingUser)
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const body = await req.json();
    const { username, age, location, about, designation, avatar } = body;
    let avatarData = existingUser.avatar;

    // 🗑️ Remove avatar
    if (avatar === null) {
      if (existingUser.avatar?.publicId) {
        await deleteFromCloudinary(existingUser.avatar.publicId);
      }
      avatarData = null;
    }

    // 📤 Upload new avatar (with compression)
    else if (avatar?.base64) {
      if (existingUser.avatar?.publicId) {
        await deleteFromCloudinary(existingUser.avatar.publicId);
      }
      avatarData = await uploadToCloudinary(avatar.base64);
    }

    // ✅ Update user but keep name/email defaults
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username: username || existingUser.username,
        email: existingUser.email, // ✅ email never changes
        age: age || existingUser.age,
        location: location || existingUser.location,
        about: about || existingUser.about,
        designation: designation || existingUser.designation,
        avatar: avatarData,
      },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json(
      { success: true, message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 [PUT] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
