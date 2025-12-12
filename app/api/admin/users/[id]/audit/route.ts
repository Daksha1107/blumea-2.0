import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { rateLimitMiddleware, limits } from '@/lib/rateLimit';
import { getCollection, Collections } from '@/lib/mongodb';
import { AuditLog } from '@/types';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const skip = (page - 1) * limit;

    const auditLogs = await getCollection<AuditLog>(Collections.AUDIT_LOGS);

    // Get audit logs for this user (either as actor or target)
    const filter: any = {
      $or: [
        { userId: new ObjectId(params.id) },
        { targetId: new ObjectId(params.id), targetType: 'user' as const },
      ],
    };

    const [items, total] = await Promise.all([
      auditLogs
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      auditLogs.countDocuments(filter),
    ]);

    return NextResponse.json({
      logs: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
