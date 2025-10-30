import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
 // NextAuth session cookie name starts with "__Secure-next-auth.session-token" (in prod) or "next-auth.session-token" (in dev)
const token =
  request.cookies.get("next-auth.session-token")?.value ||
  request.cookies.get("__Secure-next-auth.session-token")?.value ||
  "";


  // Define public routes
  const publicPaths = [
    "/login",
    "/signup",
    "/verifyemail",
    "/forgotPassword",
    "/resetPassword",
  ];

  console.log("🧭 Middleware Debug Info ------------------------");
  console.log("➡️ Path:", path);
  console.log("🔑 Token Exists:", !!token);
  console.log("📂 Is Public Path:", publicPaths.some((p) => path.startsWith(p)));
  console.log("------------------------------------------------");

  // Case 1️⃣: Logged-in user visiting public pages
  if (publicPaths.some((p) => path.startsWith(p)) && token) {
    console.log("🚫 Redirecting logged-in user from public path → '/'");
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Case 2️⃣: Non-logged-in user visiting protected route
  const isProtectedPath =
    !publicPaths.some((p) => path.startsWith(p));

  if (isProtectedPath && !token) {
    console.log("🚫 Redirecting unauthenticated user → '/login'");
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Case ✅: Allowed route
  console.log("✅ Access granted → Continuing request");
  return NextResponse.next();
}

// Apply to these routes
export const config = {
  matcher: [
    "/",
    "/user/:path*", // includes /user/[id]
    "/login",
    "/signup",
    "/verifyemail",
    "/forgotPassword",
    "/resetPassword",
    "/blog/:path*",
  ],
};
