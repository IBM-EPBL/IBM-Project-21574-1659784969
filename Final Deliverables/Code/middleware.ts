import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const region = request.geo?.region || null;

  if (request.nextUrl.pathname === "/auto") {
    if (region === "TN") {
      return NextResponse.rewrite(new URL("/?lang=tamil", request.url));
    }
  }
}
