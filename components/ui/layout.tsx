import { ReactNode } from 'react';

import { ChevronLeft } from './icons';
import { Link } from './link';

export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto min-h-screen border-l border-r bg-white p-6">
        {children}
      </div>
    </div>
  );
}

export function Divider() {
  return <hr className="my-4" />;
}

export function HomeLink() {
  return (
    <div className="border-b pb-4">
      <Link href="/" className="flex hover:no-underline">
        <ChevronLeft />
        Go Home
      </Link>
    </div>
  );
}
