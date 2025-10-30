


import jwt from "jsonwebtoken";

export const verifyJwtToken = (token) => {
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