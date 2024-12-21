import { env } from "@/env";
import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: env.NEXTAUTH_SECRET,
  });

  // Exclude the login page from being checked to avoid redirect loop

  // console.log("token===>", token);
  // console.log("pathname===>", request.nextUrl.pathname);

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  // Check the role and redirect based on the role

  if (token.role !== "ADMIN") {
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/404", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/user/:path*",
    "/dashboard/:path*",
    // Match all routes except the ones that start with /auth/login, api, _next/static, _next/image, and favicon.ico
  ],
};
