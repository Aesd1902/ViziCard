import { useState, useEffect } from 'react';

export type Platform = 'ios' | 'android' | 'web';

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>('web');

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setPlatform('ios');
    } else if (/android/i.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('web');
    }
  }, []);

  return platform;
}
