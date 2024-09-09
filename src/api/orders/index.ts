import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';

import { type ListDataResponse } from '@/types/common';
import { api } from '@/lib/api-client';

import type { IOrder, IBuyerInfo } from './types';

const getOrders = async (params?: string): Promise<ListDataResponse<IOrder>> => {
  return api.get(`/orders${params ? `?${params}` : ''}`);
};

const getOrdersForReport = async (): Promise<ListDataResponse<IOrder>> => {
  return api.get('/orders/report');
};

const getOrdersQueryOptions = (params?: string) => {
  return queryOptions({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
  });
};

const getOrdersReportQueryOptions = () => {
  return queryOptions({
    queryKey: ['orders', 'report'],
    queryFn: () => getOrdersForReport(),
  });
};

const useOrders = () => {
  const queryClient = useQueryClient();

  const QUERY_KEYS = ['orders'];

  return {
    createOrder: async (params: string) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS,
      });
    },
    deleteOrder: async (id: string) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS,
      });
    },
    updateOrder: async (order: any) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS,
      });
    },
    // Query for getting orders
    getOrders: async (params?: string) => {
      return await queryClient.fetchQuery({
        ...getOrdersQueryOptions(params),
      });
    },

    getOrdersReport: async (params?: string) => {
      return await queryClient.fetchQuery({
        ...getOrdersReportQueryOptions(),
      });
    },
  };
};

export { useOrders, IOrder, IBuyerInfo };
