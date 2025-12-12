import { z } from 'zod';

const envSchema = z.object({
  // Required
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DBNAME: z.string().min(1, 'MONGODB_DBNAME is required'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  
  // Optional
  SENTRY_DSN: z.string().optional(),
  GA4_MEASUREMENT_ID: z.string().optional(),
  REDIS_URL: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  REVALIDATION_SECRET: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function validateEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const isProduction = process.env.NODE_ENV === 'production';

  try {
    cachedEnv = envSchema.parse({
      MONGODB_URI: process.env.MONGODB_URI,
      MONGODB_DBNAME: process.env.MONGODB_DBNAME,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      SENTRY_DSN: process.env.SENTRY_DSN,
      GA4_MEASUREMENT_ID: process.env.GA4_MEASUREMENT_ID,
      REDIS_URL: process.env.REDIS_URL,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      REVALIDATION_SECRET: process.env.REVALIDATION_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    });

    return cachedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n  ');
      
      if (isProduction) {
        // In production, fail fast
        console.error('❌ Environment validation failed:\n  ' + missingVars);
        process.exit(1);
      } else {
        // In development, log warning but continue
        console.warn('⚠️  Environment validation warnings:\n  ' + missingVars);
        console.warn('⚠️  Some features may not work correctly.');
        
        // Return partial env for development
        return {
          MONGODB_URI: process.env.MONGODB_URI || '',
          MONGODB_DBNAME: process.env.MONGODB_DBNAME || '',
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
          NEXTAUTH_URL: process.env.NEXTAUTH_URL || '',
          NODE_ENV: (process.env.NODE_ENV as any) || 'development',
        } as Env;
      }
    }
    throw error;
  }
}

// Validate on import in production
if (process.env.NODE_ENV === 'production') {
  validateEnv();
}

export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    const validated = validateEnv();
    return validated[prop as keyof Env];
  },
});
