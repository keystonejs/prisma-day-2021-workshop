import React, { ReactNode } from 'react';

import { ChevronLeft } from './icons';
import { Link } from './link';

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6 bg-white min-h-screen border-l border-r">
        {children}
      </div>
    </div>
  );
}

export const Divider = () => {
  return <hr className="my-4" />;
}

export const HomeLink = () => {
  return (
    <div className="border-b pb-4">
      <Link href="/" className="flex hover:no-underline">
        <ChevronLeft />
        Go Home
      </Link>
    </div>
  );
}
