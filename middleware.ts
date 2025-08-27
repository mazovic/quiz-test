import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Verify the token by fetching user info
      const response = await fetch("http://localhost:3050/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Invalid token or expired
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const user = await response.json();

      // Check if the user is an admin
      if (!user.role || user.role.name === "user") {
        // Unauthorized user, redirect to login or unauthorized page
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // User is authorized, continue
    } catch (error) {
      console.error("Middleware error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Continue to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
