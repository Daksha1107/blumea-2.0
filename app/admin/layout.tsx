import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-bold accent-text">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session.user?.name}
            </span>
            <a
              href="/api/auth/signout"
              className="text-sm text-muted-foreground hover:accent-text"
            >
              Sign Out
            </a>
          </div>
        </div>
      </header>

      <div className="flex-1 container py-8">
        <nav className="mb-8 flex flex-wrap gap-4">
          <a href="/admin" className="px-4 py-2 rounded bg-card hover:bg-card/80">
            Dashboard
          </a>
          <a href="/admin/queue" className="px-4 py-2 rounded bg-card hover:bg-card/80">
            Queue
          </a>
          <a href="/blog" className="px-4 py-2 rounded bg-card hover:bg-card/80">
            View Site
          </a>
        </nav>

        {children}
      </div>
    </div>
  );
}
