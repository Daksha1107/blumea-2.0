import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { rateLimitMiddleware, limits } from '@/lib/rateLimit';
import { getCollection, Collections } from '@/lib/mongodb';
import { User, AuditLog } from '@/types';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  // Rate limiting for admin endpoints
  const rateLimitResponse = await rateLimitMiddleware(request, limits.admin);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { auth, response } = await requireRole('admin');
  
  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const { role, status } = body;

    // Prevent self-demotion
    if (params.id === auth.user!.id && role && role !== (auth.user as any).role) {
      return NextResponse.json(
        { error: 'You cannot change your own role' },
        { status: 403 }
      );
    }

    const users = await getCollection<User>(Collections.USERS);

    // Find existing user
    const existingUser = await users.findOne({ _id: new ObjectId(params.id) });
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (role) {
      const validRoles = ['viewer', 'contributor', 'editor', 'seo', 'publisher', 'admin'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }
      updateData.role = role;
    }

    if (status) {
      if (!['active', 'disabled'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    // Update user
    await users.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    // Log to audit trail
    try {
      const auditLogs = await getCollection<AuditLog>(Collections.AUDIT_LOGS);
      await auditLogs.insertOne({
        userId: new ObjectId(auth.user!.id),
        action: 'update_user',
        targetType: 'user',
        targetId: new ObjectId(params.id),
        changes: updateData,
        createdAt: new Date(),
      } as any);
    } catch (auditError) {
      console.error('Error logging to audit trail:', auditError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
