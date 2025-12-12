import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { UserRole } from '@/types';
import { NextResponse } from 'next/server';

const roleHierarchy: Record<UserRole, number> = {
  viewer: 1,
  contributor: 2,
  editor: 3,
  seo: 4,
  publisher: 5,
  admin: 6,
};

export async function checkAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { authenticated: false, user: null, role: null };
  }

  return {
    authenticated: true,
    user: session.user,
    role: (session.user as any).role as UserRole,
  };
}

export async function requireAuth(): Promise<
  | { auth: null; response: NextResponse }
  | { auth: NonNullable<Awaited<ReturnType<typeof checkAuth>>>; response: null }
> {
  const auth = await checkAuth();
  
  if (!auth.authenticated) {
    return {
      auth: null,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  return { auth, response: null };
}

export async function requireRole(minRole: UserRole): Promise<
  | { auth: null; response: NextResponse }
  | { auth: NonNullable<Awaited<ReturnType<typeof checkAuth>>>; response: null }
> {
  const result = await requireAuth();
  
  if (result.response) {
    return { auth: null, response: result.response };
  }

  const userRoleLevel = roleHierarchy[result.auth.role!];
  const requiredRoleLevel = roleHierarchy[minRole];

  if (userRoleLevel < requiredRoleLevel) {
    return {
      auth: null,
      response: NextResponse.json(
        { error: 'Forbidden', message: `Requires ${minRole} role or higher` },
        { status: 403 }
      ),
    };
  }

  return { auth: result.auth, response: null };
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canEdit(userRole: UserRole): boolean {
  return hasRole(userRole, 'editor');
}

export function canManageSEO(userRole: UserRole): boolean {
  return hasRole(userRole, 'seo');
}

export function canPublish(userRole: UserRole): boolean {
  return hasRole(userRole, 'publisher');
}

export function canAdmin(userRole: UserRole): boolean {
  return hasRole(userRole, 'admin');
}
