import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from './lib/routes/index';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = ['/login'];

export async function middleware(request: NextRequest) {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET!
  );
  const token = request.cookies.get('access-token')?.value;
  const typeOfUser = request.cookies.get('user-type')?.value;
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  let type;

  if (typeOfUser) {
   try {
     const { payload } = await jwtVerify(typeOfUser, secret);
     type = payload.type;
   } catch (error) {
    type = '';
   }
  }
  
  if (isPublicRoute) {
    // If user is already logged in → redirect to their dashboard
    if (token && type) {
      if (type === 'ADMIN') {
        return NextResponse.redirect(
          new URL(ROUTES.admin.dashboard.index, request.url)
        );
      }
      if (type === 'USER') {
        return NextResponse.redirect(
          new URL(ROUTES.customer.dashboard.index, request.url)
        );
      }
      if (type === 'LAWYER') {
        return NextResponse.redirect(
          new URL(ROUTES.lawer.onboarding.index, request.url)
        );
      }
    } else {
      return NextResponse.next();
    }
  }

  if (!token || !type) {
    return NextResponse.redirect(new URL(ROUTES.auth.login, request.url));
  }

  // 3. Redirect based on user role
  if (type === 'ADMIN') {
    if (!pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(
        new URL(ROUTES.admin.dashboard.index, request.url)
      );
    }
  }

  if (type === 'USER') {
    if (!pathname.startsWith('/customer')) {
      return NextResponse.redirect(
        new URL(ROUTES.customer.dashboard.index, request.url)
      );
    }
  }

  if (type === 'LAWYER') {
    if (!pathname.startsWith('/lawyer')) {
      return NextResponse.redirect(
        new URL(ROUTES.lawer.onboarding.index, request.url)
      );
    }
  }

  if (type === '') {
    return NextResponse.redirect(new URL(ROUTES.auth.login, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images|.*\\.(?:png|jpg|jpeg|gif|svg|webp)).*)'
  ]
};

