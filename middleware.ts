import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

// 특정 route만 막을 건지 아니면 특정 route ex)login 빼고 전부 막을건지 작성
const protectedRoutes = ["/game"];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!session && isProtected) {
    const absoluteURL = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
