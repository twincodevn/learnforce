import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Define which routes require authentication
        const { pathname } = req.nextUrl;
        
        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/auth/forgot-password',
          '/auth/reset-password',
          '/api/auth/register',
          '/api/test-supabase',
        ];
        
        // API routes that don't require authentication
        const publicApiRoutes = [
          '/api/auth/register',
          '/api/test-supabase',
          '/api/init-db',
          '/api/seed-data',
        ];
        
        // If it's a public route, allow access
        if (publicRoutes.includes(pathname) || publicApiRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }
        
        // For all other routes, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
