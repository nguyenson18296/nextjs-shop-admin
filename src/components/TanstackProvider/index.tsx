'use client';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';

export const TanstackProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
