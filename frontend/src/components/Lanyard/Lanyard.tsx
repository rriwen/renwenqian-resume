'use client';

// Adapted from React Bits Lanyard: https://reactbits.dev/components/lanyard
// Upstream: https://github.com/DavidHDev/react-bits

import { useEffect, useRef } from 'react';
import type { LanyardProps, Settings } from './types';
import { createLanyardScene } from './scene';
import './Lanyard.css';

export type { LanyardProps } from './types';

const Lanyard = ({
  frontImage,
  backImage,
  imageFit = 'cover',
  cardColor = '#ffffff',
  orientation = 'portrait',
  finish = 'glossy',
  cornerRadius = 0.3,
  size = 0.6,
  anchor = 'center',
  strapLength = 0.5,
  strapImage,
  strapColor = '#111111',
  strapWidth = 0.65,
  metal = 'silver',
  gravity = 1,
  damping = 0.5,
  elasticity = 0.5,
  breeze = 0.5,
  interactive = true,
  intro = true,
  className = '',
  style
}: LanyardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<Settings | null>(null);
  const applyRef = useRef<(() => void) | null>(null);

  settingsRef.current = {
    frontImage,
    backImage,
    imageFit: imageFit === 'contain' ? 'contain' : 'cover',
    cardColor,
    orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
    finish,
    cornerRadius,
    size,
    anchor,
    strapLength,
    strapImage,
    strapColor,
    strapWidth,
    metal,
    gravity,
    damping,
    elasticity,
    breeze,
    interactive,
    intro
  };

  useEffect(() => {
    applyRef.current?.();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = createLanyardScene(container, () => settingsRef.current!);
    if (!scene) return undefined;
    applyRef.current = scene.apply;
    return () => {
      applyRef.current = null;
      scene.dispose();
    };
  }, []);

  return <div ref={containerRef} className={`lanyard ${className}`.trim()} style={style} />;
};

export default Lanyard;
