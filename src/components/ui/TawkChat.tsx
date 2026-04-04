'use client';

import { useEffect } from 'react';

export default function TawkChat() {
  useEffect(() => {
    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/69d1097f06ab001c35228672/1jlc8q798';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode!.insertBefore(s1, s0);

    return () => {
      s1.parentNode?.removeChild(s1);
    };
  }, []);

  return null;
}
