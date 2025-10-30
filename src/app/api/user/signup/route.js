import { connect } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid"; // To generate verification tokens
import { sendEmail } from "@/helpers/mailer"; // Your email sending function

connect();

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    if (!password) {
  throw new Error("Password is required");
}

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verifyToken = uuidv4();
    const verifyTokenExpiry = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

    // Save user as unverified
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verifyToken,
      verifyTokenExpiry,
    });

    await newUser.save();

    // Send verification email
    await sendEmail({
      email,
      emailType: "VERIFY",
      userId: newUser._id,
      verifyToken,
    });

    return NextResponse.json({
      message: "Verification email sent. Please verify to complete signup.",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}





