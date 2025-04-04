import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 允许访问 `/login`、静态资源、API 路由
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  // 请求后端 API 检查登录状态
  const res = await fetch(`${request.nextUrl.origin}/api/check`, {
    method: "GET",
    headers: { cookie: request.headers.get("cookie") || "" },
  });

  if (res.status === 401) {
    // 如果未登录，重定向到 `/login`
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 允许访问
  return NextResponse.next();
}

// 仅应用于 `app` 目录的页面
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
};
