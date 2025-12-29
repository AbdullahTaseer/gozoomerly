'use client';

import React from 'react';
import DashNavbar from '@/components/navbar/DashNavbar';

const AllBoardsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DashNavbar hide={false} />
      {children}
    </>
  );
};

export default AllBoardsLayout;

