/* eslint-disable eslint-comments/require-description */
import { useCallback, useEffect, useState } from 'react';

type Status = 'idle' | 'fetching' | 'error' | 'fetched';
type HTTPMethod = 'POST' | 'PUT' | 'GET' | 'DELETE';

const BASE_URL = 'http://localhost:1996';

interface UseFetchDataResponse<T> {
  data: T | null;
  error: Error | null;
  status: Status;
  fetchData: () => Promise<void>;
}

function useFetchData<T = unknown>(url: string, method: HTTPMethod): UseFetchDataResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>('idle');

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
        },
      });
      if (!response.ok) {
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
  }, [method, url]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchData();
  }, [fetchData]);

  return { data, error, status, fetchData };
}

export default useFetchData;
