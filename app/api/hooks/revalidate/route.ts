import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, paths, tag, secret } = body;

    // Verify secret token
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate multiple paths
    if (paths && Array.isArray(paths)) {
      const results = [];
      for (const p of paths) {
        try {
          revalidatePath(p);
          results.push({ path: p, success: true });
        } catch (error) {
          console.error(`Failed to revalidate path ${p}:`, error);
          results.push({ path: p, success: false, error: String(error) });
        }
      }
      return NextResponse.json({ 
        success: true, 
        revalidated: true,
        results,
        message: `Revalidated ${paths.length} paths` 
      });
    }

    // Revalidate single path
    if (path) {
      revalidatePath(path);
      return NextResponse.json({ 
        success: true, 
        revalidated: true,
        message: `Path ${path} revalidated` 
      });
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ 
        success: true, 
        revalidated: true,
        message: `Tag ${tag} revalidated` 
      });
    }

    return NextResponse.json(
      { error: 'Missing path, paths, or tag parameter' },
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
