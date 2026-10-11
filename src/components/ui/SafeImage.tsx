'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  className,
  fallbackSrc,
  ...rest
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // SVG luxury placeholder with brand color and typography
  const defaultFallback = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="%23F5F0EB"/><text x="400" y="490" font-family="Georgia, serif" font-size="28" fill="%230A0A0A" text-anchor="middle" letter-spacing="4">MAISON NOIRE</text><text x="400" y="530" font-family="sans-serif" font-size="14" fill="%238B8178" text-anchor="middle" letter-spacing="2">${encodeURIComponent(alt || 'COLLECTION')}</text></svg>`;

  const imageSrc = error ? (fallbackSrc || defaultFallback) : (src || defaultFallback);

  return (
    <Image
      {...rest}
      src={imageSrc}
      alt={alt || 'Maison Noire'}
      className={cn(
        'transition-opacity duration-500',
        loaded ? 'opacity-100' : 'opacity-90',
        className
      )}
      onLoad={() => setLoaded(true)}
      onError={() => {
        setError(true);
      }}
    />
  );
}
