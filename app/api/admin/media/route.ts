import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { rateLimitMiddleware, limits } from '@/lib/rateLimit';
import { getCollection, Collections } from '@/lib/mongodb';
import { Media } from '@/types';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  // Rate limiting for admin endpoints
  const rateLimitResponse = await rateLimitMiddleware(request, limits.admin);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { auth, response } = await requireRole('contributor');
  
  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const { url, cdnUrl, mimeType, width, height, altText, caption, credit } = body;

    // Validate required fields
    if (!url || !mimeType || !altText) {
      return NextResponse.json(
        { error: 'Missing required fields: url, mimeType, and altText are required' },
        { status: 400 }
      );
    }

    // Validate altText is not empty
    if (altText.trim() === '') {
      return NextResponse.json(
        { error: 'Alt text cannot be empty' },
        { status: 400 }
      );
    }

    const media = await getCollection<Media>(Collections.MEDIA);

    const newMedia: Omit<Media, '_id'> = {
      url,
      cdnUrl: cdnUrl || url,
      mimeType,
      width,
      height,
      altText: altText.trim(),
      caption: caption?.trim(),
      credit: credit?.trim(),
      source: 'upload',
      moderationStatus: 'approved', // Auto-approve for now
      uploadedBy: new ObjectId(auth.user!.id),
      createdAt: new Date(),
    };

    const result = await media.insertOne(newMedia as any);

    return NextResponse.json({
      success: true,
      media: {
        id: result.insertedId.toString(),
        ...newMedia,
      },
    });
  } catch (error) {
    console.error('Error creating media:', error);
    return NextResponse.json(
      { error: 'Failed to create media' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Rate limiting for admin endpoints
  const rateLimitResponse = await rateLimitMiddleware(request, limits.admin);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { auth, response } = await requireRole('viewer');
  
  if (response) {
    return response;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const skip = (page - 1) * limit;

    const media = await getCollection<Media>(Collections.MEDIA);

    // Filter out deleted media
    const filter = { deletedAt: { $exists: false } };

    const [items, total] = await Promise.all([
      media
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      media.countDocuments(filter),
    ]);

    return NextResponse.json({
      media: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Rate limiting for admin endpoints
  const rateLimitResponse = await rateLimitMiddleware(request, limits.admin);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { auth, response } = await requireRole('editor');
  
  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Media ID is required' },
        { status: 400 }
      );
    }

    const media = await getCollection<Media>(Collections.MEDIA);

    // Soft delete by setting deletedAt timestamp
    const result = await media.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          deletedAt: new Date(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
