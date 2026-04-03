'use client';

import { useEffect, useState } from 'react';
export function useExploreColumnCount(): number {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setColumns(8);
      else if (w >= 1024) setColumns(6);
      else if (w >= 900) setColumns(5);
      else if (w >= 550) setColumns(4);
      else setColumns(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return columns;
}

export function splitIntoRoundRobinColumns<T>(items: T[], columnCount: number): T[][] {
  const cols: T[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, i) => {
    cols[i % columnCount].push(item);
  });
  return cols;
}
