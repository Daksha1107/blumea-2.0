import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold accent-text mb-4">SKINCARE & WELLNESS</h3>
            <p className="text-sm text-muted-foreground">
              Expert skincare reviews, guides, and wellness tips for radiant, healthy skin.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/topics/serums" className="text-muted-foreground hover:accent-text transition-colors">Serums</Link></li>
              <li><Link href="/topics/moisturizers" className="text-muted-foreground hover:accent-text transition-colors">Moisturizers</Link></li>
              <li><Link href="/topics/cleansers" className="text-muted-foreground hover:accent-text transition-colors">Cleansers</Link></li>
              <li><Link href="/topics/masks" className="text-muted-foreground hover:accent-text transition-colors">Masks</Link></li>
              <li><Link href="/topics/sunscreen" className="text-muted-foreground hover:accent-text transition-colors">Sunscreen</Link></li>
              <li><Link href="/topics/tools" className="text-muted-foreground hover:accent-text transition-colors">Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="text-muted-foreground hover:accent-text transition-colors">All Articles</Link></li>
              <li><Link href="/search" className="text-muted-foreground hover:accent-text transition-colors">Search</Link></li>
              <li><Link href="/api/rss" className="text-muted-foreground hover:accent-text transition-colors">RSS Feed</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:accent-text transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:accent-text transition-colors">Terms of Service</Link></li>
              <li><Link href="/admin" className="text-muted-foreground hover:accent-text transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Skincare & Wellness. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
