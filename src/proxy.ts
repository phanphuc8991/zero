import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const session = await auth(); //
  const isLoggedIn = !!session?.user;

  const isProtected = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname === "/sign-in";

  if (isProtected && !isLoggedIn) {
    const signinUrl = new URL("/sign-in", request.url);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

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
