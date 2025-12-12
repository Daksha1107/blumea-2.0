import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { UserRole } from '@/types';
import { NextResponse } from 'next/server';

const roleHierarchy: Record<UserRole, number> = {
  viewer: 1,
  editor: 2,
  seo: 3,
  admin: 4,
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

export async function requireAuth() {
  const auth = await checkAuth();
  
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    );
  }

  return { auth, response: null };
}

export async function requireRole(minRole: UserRole) {
  const { auth, response } = await requireAuth();
  
  if (response) {
    return { auth: null, response };
  }

  const userRoleLevel = roleHierarchy[auth.role!];
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

  return { auth, response: null };
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

export function canAdmin(userRole: UserRole): boolean {
  return hasRole(userRole, 'admin');
}
