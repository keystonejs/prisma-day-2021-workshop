import { ReactNode } from 'react';

export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6 bg-white min-h-screen border-l border-r">
        {children}
      </div>
    </div>
  );
}
