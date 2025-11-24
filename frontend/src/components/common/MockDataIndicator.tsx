'use client';

import { useEffect, useState } from 'react';
import { Alert } from 'antd';

/**
 * MockDataIndicator - Component hiển thị warning khi đang dùng mock data
 * Chỉ hiển thị trong development mode
 */
export function MockDataIndicator() {
  const [warnings, setWarnings] = useState<string[]>([]);
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isDev || typeof window === 'undefined') return;

    // Listen for custom events from apiFallback
    const handleMockDataWarning = (event: CustomEvent) => {
      const apiName = event.detail?.apiName || 'Unknown API';
      setWarnings((prev) => {
        if (!prev.includes(apiName)) {
          return [...prev, apiName];
        }
        return prev;
      });

      // Auto remove after 15 seconds
      setTimeout(() => {
        setWarnings((prev) => prev.filter((w) => w !== apiName));
      }, 15000);
    };

    window.addEventListener('mock-data-warning', handleMockDataWarning as EventListener);

    return () => {
      window.removeEventListener('mock-data-warning', handleMockDataWarning as EventListener);
    };
  }, [isDev]);

  if (!isDev || warnings.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[10000] max-w-md space-y-2">
      {warnings.map((apiName) => (
        <Alert
          key={apiName}
          message="⚠️ Using Mock Data"
          description={`API ${apiName} failed. Check console for details.`}
          type="warning"
          closable
          onClose={() => setWarnings((prev) => prev.filter((w) => w !== apiName))}
          showIcon
        />
      ))}
    </div>
  );
}

