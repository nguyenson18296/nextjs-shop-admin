import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { type ListDataResponse } from '@/types/common';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { IVoucher } from './type';

const schema = z.object({
  code: z.string().min(1, { message: 'Mã voucher không được để trống' }),
  discount_value: z.number().min(1, { message: 'Giá trị giảm giá không hợp lệ' }),
  usage_limit: z.number().min(1, { message: 'Số lần sử dụng không hợp lệ' }),
  is_active: z.boolean().default(true),
  valid_from: z.string().min(1, { message: 'Ngày bắt đầu không hợp lệ' }),
  valid_to: z.string().min(1, { message: 'Ngày kết thúc không hợp lệ' }),
});

type UseCreateVoucherOptions = {
  mutationConfig?: MutationConfig<typeof schema>;
};

const getVouchers = async (params?: string): Promise<ListDataResponse<IVoucher>> => {
  return api.get(`/vouchers${params ? `?${params}` : ''}`);
};

const createVoucher = async (data: IVoucher) => {
  return api.post('/vouchers', data);
};

const updateVoucher = async (id: string, data: Partial<IVoucher>) => {
  return api.put(`/vouchers/${id}`, data);
};

const deleteVoucher = async (id: string) => {
  return api.delete(`/vouchers/${id}`);
};

const getVouchersQueryOptions = (params?: string) => {
  return queryOptions({
    queryKey: ['vouchers', params],
    queryFn: () => getVouchers(params),
  });
};

const useVouchers = (params?: string) => {
  return useQuery({
    ...getVouchersQueryOptions(params),
  });
};

const useCreateVoucher = ({ mutationConfig }: UseCreateVoucherOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationKey: ['vouchers'],
    onSuccess: (response: any) => {
      if (response.success) {
        return queryClient.invalidateQueries();
      }
    },
    ...restConfig,
    mutationFn: createVoucher,
  });
};

const useUpdateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: Partial<IVoucher>) => updateVoucher(form.id ?? "", form),
    onSuccess: (response: any) => {
      if (response.success) {
        return queryClient.invalidateQueries();
      }
    },
  });
};

const useDeleteVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVoucher,
    onSuccess: (response: any) => {
      if (response.success) {
        console.log('Delete voucher success');
        return queryClient.invalidateQueries();
      }
    },
  });
};

export { useVouchers, useCreateVoucher, useDeleteVoucher, useUpdateVoucher, schema, type IVoucher };
