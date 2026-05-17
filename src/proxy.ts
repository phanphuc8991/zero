import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/auth";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   console.log("Proxy intercepted URL:", pathname);

//   // 1. Fetch user session from NextAuth (Auth.js)
//   const session = await auth();
//   const isLoggedIn = !!session?.user;

//   // 2. Define route boundaries
//   const isProtected = pathname.startsWith("/dashboard");
//   const isAuthRoute = pathname === "/signin";

//   // CASE 1: Unauthenticated user attempting to access protected routes
//   if (isProtected && !isLoggedIn) {
//     const signinUrl = new URL("/signin", request.url);
//     // Persist the intended destination so users are redirected back after logging in
//     signinUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(signinUrl);
//   }

//   // CASE 2: Authenticated user attempting to access the sign-in page
//   if (isAuthRoute && isLoggedIn) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   /*
//    * Matcher configuration to optimize performance:
//    * 1. Applies globally to all application routes.
//    * 2. Excludes static assets (_next/static, images, favicon) to save server resources.
//    * 3. Excludes NextAuth internal API routes (/api/auth) to prevent infinite redirect loops.
//    */
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
//   ],
// };

// Khởi tạo một hàm auth chạy riêng cho tầng Edge/Proxy
const { auth } = NextAuth(authConfig);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const session = await auth(); //
  const isLoggedIn = !!session?.user;

  const isProtected = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname === "/sign-in";
  console.log("run.... 1");
  if (isProtected && !isLoggedIn) {
    const signinUrl = new URL("/sign-in", request.url);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }
  console.log("run.... 2");
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/courses", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
