'use client';

import * as React from 'react';
import { IOrder, useOrders } from '@/api/orders';
import { type TPaymentStatus } from '@/api/orders/types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip, { ChipPropsColorOverrides } from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { OverridableStringUnion } from '@mui/types';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';

const statusMap = {
  PENDING: { label: 'PENDING', color: 'warning' },
  COMPLETED: { label: 'COMPLETED', color: 'success' },
  CANCELED: { label: 'CANCELED', color: 'error' },
  REJECTED: { label: 'REJECTED', color: 'default' },
} satisfies {
  [key: string]: {
    label: TPaymentStatus;
    color: OverridableStringUnion<
      'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
      ChipPropsColorOverrides
    >;
  };
};

export interface Order {
  id: string;
  customer: { name: string };
  amount: number;
  status: TPaymentStatus;
  createdAt: Date;
}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
}

export function LatestOrders({ sx }: LatestOrdersProps): React.JSX.Element {
  const [orders, setOrders] = React.useState<IOrder[]>([]);

  const { getOrders } = useOrders();

  const fetchOrders = React.useCallback(async () => {
    const data = await getOrders('limit=5');
    console.log('data', data);
    setOrders(data.data);
  }, []);

  console.log('orders', orders);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Card sx={sx}>
      <CardHeader title="Latest orders" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell sortDirection="desc">Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const { label, color } = statusMap[order.payment_status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{order.buyer_info.username}</TableCell>
                  <TableCell>{dayjs(order.created_at).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
          LinkComponent={'a'}
          href="/dashboard/don-mua"
        >
          Xem tất cả
        </Button>
      </CardActions>
    </Card>
  );
}
