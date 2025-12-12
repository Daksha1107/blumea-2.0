'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);

  if (!isVisible) return null;

  const handleAccept = () => {
    document.cookie = 'cookie-consent=accepted; max-age=31536000; path=/';
    setIsVisible(false);
  };

  const handleDecline = () => {
    document.cookie = 'cookie-consent=declined; max-age=31536000; path=/';
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border p-4 shadow-lg">
      <div className="container max-w-6xl mx-auto">
        {!showPreferences ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-foreground">
                We use cookies to enhance your browsing experience and analyze our traffic. 
                By clicking "Accept", you consent to our use of cookies.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferences(true)}
              >
                Preferences
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-accent hover:bg-accent/90"
              >
                Accept
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Cookie Preferences</h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Essential Cookies</p>
                  <p className="text-xs text-muted-foreground">Required for the website to function</p>
                </div>
                <div className="text-sm text-muted-foreground">Always Active</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Analytics Cookies</p>
                  <p className="text-xs text-muted-foreground">Help us improve the website</p>
                </div>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
              >
                Save & Close
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-accent hover:bg-accent/90"
              >
                Accept All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
