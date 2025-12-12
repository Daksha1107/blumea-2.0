import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { checkRateLimit, limits } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  const { auth, response } = await requireRole('viewer');
  
  if (response) {
    return response;
  }

  try {
    const ip = getClientIp(request);
    
    // Check quota for different limit types
    const [adminQuota, llmQuota] = await Promise.all([
      checkRateLimit(`admin:${ip}`, limits.admin),
      checkRateLimit(`llm:${ip}`, limits.llm),
    ]);

    return NextResponse.json({
      admin: {
        limit: adminQuota.limit,
        remaining: adminQuota.remaining,
        reset: adminQuota.reset,
        resetDate: new Date(adminQuota.reset).toISOString(),
      },
      llm: {
        limit: llmQuota.limit,
        remaining: llmQuota.remaining,
        reset: llmQuota.reset,
        resetDate: new Date(llmQuota.reset).toISOString(),
        warningThreshold: Math.floor(llmQuota.limit * 0.2), // 20% threshold
        isNearLimit: llmQuota.remaining < Math.floor(llmQuota.limit * 0.2),
      },
    });
  } catch (error) {
    console.error('Error fetching quota:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quota' },
      { status: 500 }
    );
  }
}
