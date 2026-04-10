import { Suspense } from 'react';
import MemoriesViewClient from './MemoriesViewClient';

export default function MemoriesViewPage() {
  return (
    <Suspense
      fallback={
        <div className="text-black min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
        </div>
      }
    >
      <MemoriesViewClient />
    </Suspense>
  );
}
