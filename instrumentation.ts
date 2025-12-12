export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initSentry } = await import('./lib/sentry');
    const { startPublishWorker } = await import('./lib/jobs/publish');

    // Initialize Sentry
    initSentry();

    // Start background workers
    if (process.env.NODE_ENV === 'production') {
      startPublishWorker();
    }
  }
}
