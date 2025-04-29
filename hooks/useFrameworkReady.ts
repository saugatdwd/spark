import { useEffect, useState } from 'react';

export function useFrameworkReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.frameworkReady) {
      window.frameworkReady?.();
    }
    setReady(true);
  }, []);

  return ready;
}
