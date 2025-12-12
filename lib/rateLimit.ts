import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from './env';
import { NextRequest, NextResponse } from 'next/server';

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) {
    return ratelimit;
  }

  // Only initialize if Upstash credentials are available
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('⚠️  Upstash Redis not configured, rate limiting disabled');
    return null;
  }

  try {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
      analytics: true,
      prefix: 'blumea_ratelimit',
    });

    return ratelimit;
  } catch (error) {
    console.error('Failed to initialize rate limiter:', error);
    return null;
  }
}

export async function checkRateLimit(
  identifier: string,
  limit?: { requests: number; window: string }
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const limiter = getRatelimit();

  if (!limiter) {
    // If rate limiting is not configured, allow all requests
    return {
      success: true,
      limit: Infinity,
      remaining: Infinity,
      reset: 0,
    };
  }

  // Custom limit if provided
  if (limit) {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL!,
      token: env.UPSTASH_REDIS_REST_TOKEN!,
    });
    
    const customLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit.requests, limit.window as any),
      analytics: true,
      prefix: 'blumea_ratelimit',
    });

    const result = await customLimiter.limit(identifier);
    return result;
  }

  const result = await limiter.limit(identifier);
  return result;
}

export function getClientIp(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return 'unknown';
}

export async function rateLimitMiddleware(
  request: NextRequest,
  limit?: { requests: number; window: string }
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const result = await checkRateLimit(ip, limit);

  if (!result.success) {
    const resetDate = new Date(result.reset);
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);

    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        limit: result.limit,
        remaining: result.remaining,
        reset: resetDate.toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': retryAfter.toString(),
        },
      }
    );
  }

  return null;
}
