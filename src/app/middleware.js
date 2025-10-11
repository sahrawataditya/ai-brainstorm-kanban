import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(request) {
  const token = request.cookies.get("auth-token");
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isPublicPage = request.nextUrl.pathname === "/";
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");

  if (isPublicPage || isApiRoute) {
    return NextResponse.next();
  }

  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && !isAuthPage) {
    const decoded = verifyToken(token.value);
    if (!decoded) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-token");
      return response;
    }
  }

  if (isAuthPage && token && verifyToken(token.value)) {
    return NextResponse.redirect(new URL("/board", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
