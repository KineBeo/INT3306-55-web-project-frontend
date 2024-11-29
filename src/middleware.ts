import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token");

    if (!token) {
        const loginUrl = new URL("/auth/signin", req.url);
        loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|auth|verify|$).*)',
    ],
}