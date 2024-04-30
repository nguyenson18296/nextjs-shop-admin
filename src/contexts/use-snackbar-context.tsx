'use client'
import React, { createContext, useCallback, useContext, useState } from 'react';
import { Alert, Snackbar, type AlertColor } from '@mui/material';

interface SnackbarProviderInterface {
  children: React.ReactNode;
}

interface SnackbarContextType {
  showSnackbar: (message: string, severity: AlertColor) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export function SnackbarProvider({ children }: SnackbarProviderInterface): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [message, setMessage] = useState('');

  const showSnackbar = useCallback((messageArg: string, severityArg: AlertColor) => {
    setOpen(true);
    setMessage(messageArg);
    setSeverity(severityArg);
  }, []);

  const hideSnackbar = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      {open ? (
        <Snackbar open={open} autoHideDuration={5000} onClose={hideSnackbar}>
          <Alert onClose={hideSnackbar} severity={severity} variant="filled" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      ) : null}
    </SnackbarContext.Provider>
  );
}
