


import jwt from "jsonwebtoken";

export const verifyJwtToken = (token) => {
  // Guard: if no token provided, return null rather than calling jwt.verify
  if (!token) {
    console.error("verifyJwtToken: no token provided");
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("✅ Token valid, decoded:", decoded);
    return decoded;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.error("❌ Token expired at:", err.expiredAt);
    } else {
      console.error("❌ Token invalid:", err.message);
    }
    return null; // user undefined
  }
};