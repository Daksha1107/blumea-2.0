'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get the latest skincare tips and reviews delivered to your inbox.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading' || status === 'success'}
        />
        <Button
          type="submit"
          className="w-full accent-bg hover:bg-[#b89952]"
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading'
            ? 'Subscribing...'
            : status === 'success'
            ? 'Subscribed!'
            : 'Subscribe'}
        </Button>
      </form>
      
      {status === 'error' && (
        <p className="text-sm text-destructive mt-2">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
