import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Terms of Service - Skincare & Wellness',
  description: 'Terms of service for Skincare & Wellness blog',
  canonical: `${process.env.NEXTAUTH_URL}/terms`,
});

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1>Terms of Service</h1>
          
          <p className="text-muted-foreground">Last updated: December 12, 2025</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by
            the terms and provision of this agreement.
          </p>
          
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials
            on Skincare & Wellness website for personal, non-commercial transitory viewing only.
          </p>
          
          <h2>3. Disclaimer</h2>
          <p>
            The materials on Skincare & Wellness website are provided on an 'as is' basis.
            Skincare & Wellness makes no warranties, expressed or implied, and hereby
            disclaims and negates all other warranties including, without limitation,
            implied warranties or conditions of merchantability, fitness for a particular
            purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          
          <h2>4. Limitations</h2>
          <p>
            In no event shall Skincare & Wellness or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or profit,
            or due to business interruption) arising out of the use or inability to use
            the materials on Skincare & Wellness website.
          </p>
          
          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on Skincare & Wellness website could include
            technical, typographical, or photographic errors. Skincare & Wellness does
            not warrant that any of the materials on its website are accurate, complete
            or current.
          </p>
          
          <h2>6. Links</h2>
          <p>
            Skincare & Wellness has not reviewed all of the sites linked to its website
            and is not responsible for the contents of any such linked site.
          </p>
          
          <h2>7. Modifications</h2>
          <p>
            Skincare & Wellness may revise these terms of service for its website at
            any time without notice. By using this website you are agreeing to be bound
            by the then current version of these terms of service.
          </p>
          
          <h2>8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with
            the laws and you irrevocably submit to the exclusive jurisdiction of the
            courts in that location.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
