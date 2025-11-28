import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware để bảo vệ các routes cần authentication
 * Chạy trước khi request được xử lý
 * 
 * Lưu ý: Middleware chạy ở Edge Runtime, không thể truy cập localStorage
 * Nên cần dùng cookies hoặc kết hợp với client-side protection
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Lấy token từ cookies (nếu có)
  // Token có thể được set từ client sau khi login
  const token = request.cookies.get('access_token')?.value;

  // Các routes công khai - không cần auth
  const publicRoutes = [
    '/',
    '/posts',
    '/tags',
    '/search',
    '/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];

  // Các routes cần authentication
  const protectedRoutes = [
    '/admin',
    '/editor',
    '/me',
    '/notifications',
  ];

  // Kiểm tra nếu route cần protection
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Kiểm tra nếu route là auth page
  const isAuthRoute = pathname.startsWith('/auth/');

  // Nếu là protected route và không có token trong cookies
  // Redirect sẽ được xử lý ở client-side vì middleware không thể đọc localStorage
  // Nhưng vẫn có thể check cookies nếu token được sync vào cookies
  if (isProtectedRoute && !token) {
    // Có thể redirect hoặc để client-side xử lý
    // Vì token có thể chỉ có trong localStorage (client-side only)
    // Nên để client-side component xử lý redirect
  }

  // Nếu đã có token trong cookies và đang ở trang login/register, redirect về home
  if (token && isAuthRoute && (pathname === '/login' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Cho phép request tiếp tục
  // Client-side protection sẽ xử lý redirect nếu cần
  return NextResponse.next();
}

/**
 * Config matcher để chỉ chạy middleware cho các routes cụ thể
 * Tối ưu performance bằng cách không chạy middleware cho static files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

