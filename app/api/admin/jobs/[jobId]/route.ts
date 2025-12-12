import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { getCollection, Collections } from '@/lib/mongodb';
import { PublishJob } from '@/types';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: {
    jobId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { auth, response } = await requireRole('viewer');
  
  if (response) {
    return response;
  }

  try {
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
