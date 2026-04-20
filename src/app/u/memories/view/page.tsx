import { Suspense } from 'react';
import MemoriesViewClient from './MemoriesViewClient';
import { SkeletonPageCenter } from '@/components/skeletons';

export default function MemoriesViewPage() {
  return (
    <Suspense fallback={<SkeletonPageCenter />}>
      <MemoriesViewClient />
    </Suspense>
  );
}
