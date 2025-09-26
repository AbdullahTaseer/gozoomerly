import type { NextRequest } from 'next/server';
import { authMiddleware } from './middleware/auth';

export function middleware(request: NextRequest) {

  return authMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}; 