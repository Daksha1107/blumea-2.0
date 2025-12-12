import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCollection, Collections } from '@/lib/mongodb';
import { PublishJob } from '@/types';
import { requireRole } from '@/lib/rbac';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: {
    jobId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !requireRole(session.user.role, 'viewer')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobs = await getCollection<PublishJob>(Collections.PUBLISH_JOBS);
    const job = await jobs.findOne({ _id: new ObjectId(params.jobId) });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}
