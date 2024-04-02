/* eslint-disable eslint-comments/require-description */
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'fetching' | 'error' | 'fetched';
type HTTPMethod = 'POST' | 'PUT' | 'GET' | 'DELETE';

const BASE_URL = 'http://localhost:1996';

interface UseFetchDataResponse<T> {
  data: T | null;
  error: Error | null;
  status: Status;
  fetchData: () => Promise<void>;
}

function useFetchData<T = unknown>(url: string, method: HTTPMethod = 'GET'): UseFetchDataResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const token = localStorage.getItem('custom-auth-token') || '';
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setStatus('fetching');
    setData(null);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/dang-nhap')
        }
        throw new Error('Network response was not ok');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const dataResponse: T = await response.json();
      setData(dataResponse);
      setStatus('fetched');
    } catch (err) {
      setError(err as Error);
      setStatus('error');
    }
  }, [method, url, router, token]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchData();
  }, [fetchData]);

  return { data, error, status, fetchData };
}

export default useFetchData;
