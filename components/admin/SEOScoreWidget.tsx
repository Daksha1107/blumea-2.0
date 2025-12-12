'use client';

import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { SEOMetadata } from '@/types';

interface SEOScoreWidgetProps {
  seo: SEOMetadata;
  bodyHtml: string;
}

export function SEOScoreWidget({ seo, bodyHtml }: SEOScoreWidgetProps) {
  // Check individual SEO criteria
  const checks = [
    {
      label: 'Meta title present (50-60 chars)',
      pass: seo.title.length >= 50 && seo.title.length <= 60,
      critical: true,
    },
    {
      label: 'Meta description present (150-160 chars)',
      pass: seo.description.length >= 150 && seo.description.length <= 160,
      critical: true,
    },
    {
      label: 'H1 heading present (only one)',
      pass: (bodyHtml.match(/<h1/g) || []).length === 1,
      critical: true,
    },
    {
      label: 'Primary keyword set',
      pass: !!seo.primaryKeyword && seo.primaryKeyword.length > 0,
      critical: false,
    },
    {
      label: 'OG image present',
      pass: !!seo.ogImage && seo.ogImage.length > 0,
      critical: false,
    },
    {
      label: 'At least 3 internal links',
      pass: (bodyHtml.match(/<a href/g) || []).length >= 3,
      critical: false,
    },
  ];

  const passedCount = checks.filter((c) => c.pass).length;
  const criticalFailures = checks.filter((c) => c.critical && !c.pass);
  const score = Math.round((passedCount / checks.length) * 100);

  return (
    <div className="space-y-4 p-6 bg-card border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">SEO Score</h3>
        <div className={`text-3xl font-bold ${
          score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'
        }`}>
          {score}%
        </div>
      </div>

      <div className="space-y-2">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            {check.pass ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : check.critical ? (
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            )}
            <span className={check.pass ? 'text-muted-foreground' : ''}>
              {check.label}
              {check.critical && !check.pass && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {criticalFailures.length > 0 && (
        <div className="pt-4 border-t">
          <p className="text-sm text-red-500 font-medium">
            ⚠️ {criticalFailures.length} critical issue(s) must be fixed before publishing
          </p>
        </div>
      )}

      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          * Critical items must pass to publish
        </p>
      </div>
    </div>
  );
}
