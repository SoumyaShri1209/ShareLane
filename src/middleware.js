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
    console.log("🚫 Redirecting logged-in user from public path → '/posts'");
    return NextResponse.redirect(new URL("/posts", request.nextUrl));
  }

  // Case 2️⃣: Non-logged-in user visiting protected route
  // Define routes that require authentication. Keep '/posts' public so blogs are viewable when logged-out.
  const protectedPrefixes = [
    "/create-blog",
    "/user",
    "/posts/edit",
  ];

  const isTryingToAccessProtected = protectedPrefixes.some((p) => path.startsWith(p));

  // If user is NOT logged in and tries to access protected pages, send them to landing page '/'
  if (isTryingToAccessProtected && !token) {
    console.log("🚫 Unauthenticated user trying to access protected route → redirect to '/'");
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // If user is logged in and tries to access root '/', restrict access and send to '/posts'
  if (token && path === "/") {
    console.log("🔒 Logged-in user trying to access '/' → redirect to '/posts'");
    return NextResponse.redirect(new URL("/posts", request.nextUrl));
  }

  // Redirect any legacy '/blog' path to '/posts'
  if (path.startsWith("/blog")) {
    return NextResponse.redirect(new URL("/posts", request.nextUrl));
  }

  // Case ✅: Allowed route
  console.log("✅ Access granted → Continuing request");
  return NextResponse.next();
}

// Apply to these routes
export const config = {
  matcher: [
    "/",
    "/user/:path*",
    "/login",
    "/signup",
    "/verifyemail",
    "/forgotPassword",
    "/resetPassword",
    "/posts/:path*",
    "/create-blog/:path*",
    "/blog/:path*",
  ],
};
