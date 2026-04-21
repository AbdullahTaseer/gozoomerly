'use client';

import { useEffect, useLayoutEffect, useState } from 'react';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function computeColumnCount(): number {
  if (typeof window === 'undefined') return 0;
  const w = window.innerWidth;
  if (w >= 1280) return 8;
  if (w >= 1024) return 6;
  if (w >= 900) return 5;
  if (w >= 550) return 4;
  return 3;
}

export function useExploreColumnCount(): number {
  const [columns, setColumns] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const update = () => setColumns(computeColumnCount());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return columns;
}

export function splitIntoRoundRobinColumns<T>(items: T[], columnCount: number): T[][] {
  if (columnCount <= 0) return [];
  const cols: T[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, i) => {
    cols[i % columnCount].push(item);
  });
  return cols;
}
