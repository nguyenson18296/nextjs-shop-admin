import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import StoreProvider from './StoreProvider';
import { SnackbarProvider } from '@/contexts/use-snackbar-context';
import { TanstackProvider } from '@/components/TanstackProvider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <TanstackProvider>
          <StoreProvider>
            <LocalizationProvider>
              <UserProvider>
                <SnackbarProvider>
                  <ThemeProvider>{children}</ThemeProvider>
                </SnackbarProvider>
              </UserProvider>
            </LocalizationProvider>
          </StoreProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
