import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, secret } = body;

    // Verify secret token
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ 
        success: true, 
        revalidated: true,
        message: `Path ${path} revalidated` 
      });
    }

    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ 
        success: true, 
        revalidated: true,
        message: `Tag ${tag} revalidated` 
      });
    }

    return NextResponse.json(
      { error: 'Missing path or tag parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
