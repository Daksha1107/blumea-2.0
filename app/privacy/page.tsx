import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Privacy Policy - Skincare & Wellness',
  description: 'Privacy policy for Skincare & Wellness blog',
  canonical: `${process.env.NEXTAUTH_URL}/privacy`,
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1>Privacy Policy</h1>
          
          <p className="text-muted-foreground">Last updated: December 12, 2025</p>
          
          <h2>1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including when you
            create an account, subscribe to our newsletter, or contact us for support.
          </p>
          
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services,
            to communicate with you, and to personalize your experience.
          </p>
          
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable
            information to third parties without your consent, except as required by law.
          </p>
          
          <h2>4. Cookies</h2>
          <p>
            We use cookies and similar technologies to collect information about your
            browsing activities and to personalize your experience. You can control
            cookies through your browser settings.
          </p>
          
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect
            your personal information against unauthorized access, alteration, disclosure,
            or destruction.
          </p>
          
          <h2>6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information.
            You may also object to or restrict certain processing of your information.
          </p>
          
          <h2>7. Children&apos;s Privacy</h2>
          <p>
            Our services are not directed to children under 13. We do not knowingly
            collect personal information from children under 13.
          </p>
          
          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you
            of any changes by posting the new policy on this page.
          </p>
          
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at
            privacy@blumea.com
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
