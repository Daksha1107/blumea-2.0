import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { rateLimitMiddleware, limits } from '@/lib/rateLimit';
import { getCollection, Collections } from '@/lib/mongodb';
import { User, AuditLog } from '@/types';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
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
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const users = await getCollection<User>(Collections.USERS);

    // Build search filter
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      users
        .find(filter, { projection: { passwordHash: 0 } }) // Exclude password
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      users.countDocuments(filter),
    ]);

    return NextResponse.json({
      users: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { email, name, role } = body;

    // Validate required fields
    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, and role' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['viewer', 'contributor', 'editor', 'seo', 'publisher', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const users = await getCollection<User>(Collections.USERS);

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Generate temporary password (in production, send invite email)
    // TODO: Properly hash password with bcrypt in production
    const tempPassword = Math.random().toString(36).slice(-8);

    const newUser: Omit<User, '_id'> = {
      email,
      name,
      role,
      status: 'active',
      passwordHash: tempPassword, // TODO: In production, use bcrypt.hash(tempPassword, 10)
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser as any);

    // Log to audit trail
    try {
      const auditLogs = await getCollection<AuditLog>(Collections.AUDIT_LOGS);
      await auditLogs.insertOne({
        userId: new ObjectId(auth.user!.id),
        action: 'create_user',
        targetType: 'user',
        targetId: result.insertedId,
        changes: { email, name, role },
        createdAt: new Date(),
      } as any);
    } catch (auditError) {
      console.error('Error logging to audit trail:', auditError);
    }

    return NextResponse.json({
      success: true,
      userId: result.insertedId.toString(),
      tempPassword, // In production, send via email instead
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
