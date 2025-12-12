export default function AdminQueuePage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Publish Queue</h2>

      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground">
          Queue monitoring interface will be displayed here. This shows background jobs for article publishing.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Jobs are processed automatically when Redis/Upstash is configured.
        </p>
      </div>
    </div>
  );
}
