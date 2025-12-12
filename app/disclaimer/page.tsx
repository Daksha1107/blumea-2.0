import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Medical Disclaimer - Skincare & Wellness',
  description: 'Medical disclaimer for Skincare & Wellness blog',
  canonical: `${process.env.NEXTAUTH_URL}/disclaimer`,
});

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1>Medical Disclaimer</h1>
          
          <p className="text-muted-foreground">Last updated: December 12, 2025</p>
          
          <div className="bg-card border border-accent/30 rounded-lg p-6 my-6">
            <p className="text-accent font-semibold mb-2">Important Notice</p>
            <p className="text-sm mb-0">
              The content on this website is for informational purposes only and should
              not be considered medical advice. Always consult with a qualified healthcare
              professional before making any decisions about your skincare or health.
            </p>
          </div>
          
          <h2>1. Not Medical Advice</h2>
          <p>
            The information provided on Skincare & Wellness is for educational and
            informational purposes only. It is not intended to be a substitute for
            professional medical advice, diagnosis, or treatment.
          </p>
          
          <h2>2. Consult Your Doctor</h2>
          <p>
            Always seek the advice of your physician or other qualified health provider
            with any questions you may have regarding a medical condition or skincare concern.
            Never disregard professional medical advice or delay in seeking it because
            of something you have read on this website.
          </p>
          
          <h2>3. Individual Results May Vary</h2>
          <p>
            Product reviews and recommendations on this site are based on our research
            and personal experience. Results may vary from person to person. What works
            for one person may not work for another.
          </p>
          
          <h2>4. Patch Testing</h2>
          <p>
            Before using any new skincare product, we recommend performing a patch test
            to check for allergic reactions or sensitivity. Discontinue use if irritation occurs.
          </p>
          
          <h2>5. Product Claims</h2>
          <p>
            Any claims made about specific products are based on the manufacturer's
            statements and available research. We make no guarantees about the effectiveness
            of any product mentioned on this site.
          </p>
          
          <h2>6. Affiliate Disclosure</h2>
          <p>
            This website may contain affiliate links. If you purchase a product through
            an affiliate link, we may receive a commission at no additional cost to you.
            This does not influence our reviews or recommendations.
          </p>
          
          <h2>7. Accuracy of Information</h2>
          <p>
            While we strive to provide accurate and up-to-date information, skincare
            science is constantly evolving. Information on this site may become outdated
            and should not be relied upon as current.
          </p>
          
          <h2>8. Emergency Situations</h2>
          <p>
            If you are experiencing a medical emergency, including severe allergic
            reactions or skin conditions, call emergency services or visit your nearest
            emergency room immediately.
          </p>
          
          <h2>9. Contact Us</h2>
          <p>
            If you have questions about this disclaimer, please contact us at
            info@blumea.com
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
