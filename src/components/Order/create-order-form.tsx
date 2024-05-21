/* eslint-disable react/hook-use-state */
'use client';

import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import {
  Button,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { useRouter } from 'next/navigation';

import { type ProductInterface } from '../dashboard/product/products-table';
import { OrderLineItems } from './order-line-items';
import { BASE_URL } from '@/utils/constants';

const FormPaper = styled(Paper)({
  backgroundColor: '#ffffff',
  color: '#212636',
  transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  boxShadow: 'rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
  backgroundImage: 'none',
  overflow: 'hidden',
  borderRadius: '20px',
});

export type ProductOrderType = Pick<ProductInterface, 'id' | 'title' | 'thumbnail' | 'price' | 'discount_price'> & {
  quantity: number;
};

export interface FormInputInterface {
  order_number: string;
  issued_date: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  products: ProductOrderType[];
}

interface CreateOrderDataInterface {
  order_number: string;
  issued_date: string;
  line_items: {
    id: number;
    quantity: number
  }[];
  payment_status: "PENDING",
  contact_detail: {
    address: string;
    first_name: string;
    last_name: string;
    phone: string;
  }
}

const schema = zod.object({
  order_number: zod.string({
    required_error: 'Không được để trống'
  }),
  issued_date: zod.any({
    required_error: 'Không được để trống'
  }),
  first_name: zod.string({
    required_error: 'Không được để trống'
  }),
  last_name: zod.string({
    required_error: 'Không được để trống'
  }),
  address: zod.string({
    required_error: 'Không được để trống'
  }),
  phone: zod.string({
    required_error: 'Không được để trống'
  })
})

export function CreateOrderForm(): React.JSX.Element {
  const { handleSubmit, control, setError, formState: { errors } } = useForm<FormInputInterface>({
    resolver: zodResolver(schema)
  });
  const [productsDisplay, setProductDisplay] = useState<ProductOrderType[]>([]);
  const token = localStorage.getItem('custom-auth-token') || '';
  const router = useRouter();

  const onSubmit = useCallback(async (data: FormInputInterface) => {
    if (productsDisplay.length === 0) {
      setError('products', {
        message: 'Vui lòng thêm sản phẩm'
      })
    }
    const submitData: SubmitHandler<CreateOrderDataInterface> = {
      order_number: data.order_number,
      issued_date: data.issued_date,
      payment_status: "PENDING",
      line_items: productsDisplay.map(prod => ({
        id: prod.id,
        quantity: prod.quantity
      })),
      contact_detail: {
        address: data.address,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      }
    }
    try {
      await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      })
      router.push('/dashboard/don-mua')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, [setError, token, router, productsDisplay]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormPaper>
        <CardContent>
          <Stack spacing={4}>
            <Stack spacing={3}>
              <Typography component="h6">Basic information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name="order_number"
                      rules={{ required: true }}
                      control={control}
                      render={({ field }) => <TextField label="Mã hoá đơn" variant="outlined" error={Boolean(errors.order_number)} helperText={errors.order_number?.message} {...field} />}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name="issued_date"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePicker
                          label="Ngày phát hành"
                          disablePast
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: 'outlined',
                              error: Boolean(errors.issued_date),
                              helperText: errors.issued_date?.message,
                            },
                          }}
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Stack>
            <Divider />
            <Stack spacing={3}>
              <Typography component="h6">Thông tin giao hàng</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name="first_name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <TextField label="Họ" variant="outlined" error={Boolean(errors.first_name)} helperText={errors.first_name?.message} {...field} />}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name="last_name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <TextField label="Tên" variant="outlined" error={Boolean(errors.last_name)} helperText={errors.last_name?.message} {...field} />}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name="address"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <TextField label="Địa chỉ" error={Boolean(errors.address)} helperText={errors.address?.message} variant="outlined" {...field} />}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name="phone"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <TextField label="Số điện thoại" error={Boolean(errors.phone)} helperText={errors.phone?.message} variant="outlined" {...field} />}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Stack>
            <Divider />
            <OrderLineItems errors={errors} setProductDisplay={setProductDisplay} productsDisplay={productsDisplay} />
          </Stack>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="contained" type="submit">
            Tạo đơn mua
          </Button>
        </CardActions>
      </FormPaper>
    </form>
  );
}
