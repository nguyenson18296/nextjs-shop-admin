'use client';

/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Avatar, Box, Card, Checkbox, IconButton, Stack, TableCell, TablePagination, Typography } from '@mui/material';

import { type TableColumnInterface } from '@/types/common';
import { type UserInterface } from '@/types/user';
import useFetchData from '@/hooks/use-fetch';
import { useSelection } from '@/hooks/use-selection';

import { type ProductInterface } from '../dashboard/product/products-table';
import { TableComponent } from '../table/Table';
import { OrderDetails } from './order-details';
import OrderStatus from './order-status';

interface OrderInterface {
  id: string;
  order_number: string;
  issued_date: string;
  payment_status: 'PENDING';
  buyer_info: UserInterface;
  order_items: {
    id: string;
    quantity: number;
    product: ProductInterface;
  }[];
}

type TPaymentStatus = 'COMPLETED' | 'PENDING' | 'CANCELED' | 'REJECTED';

export function OrdersTable(): React.JSX.Element {
  const [pagination, setPagination] = useState<{ page: number; limit: number }>({ page: 1, limit: 10 });
  const { data: orders } = useFetchData<{ data: OrderInterface[]; total: number; page: number; limit: number; }>(`/orders?page=${pagination.page}&limit=${pagination.limit}`, 'GET');
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderInterface | null>();

  const rowIds = useMemo(() => {
    return (orders?.data || []).map((order) => order.id);
  }, [orders?.data]);

  const { selectAll, deselectAll, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < (orders?.data || []).length;
  const selectedAll = (orders?.data || []).length > 0 && selected?.size === (orders?.data || []).length;

  const onOpenOrderDetails = useCallback(
    (orderId: string) => {
      const selectedOrderFounded = orders?.data.find((order) => order.id === orderId);
      if (selectedOrderFounded) {
        setSelectedOrder(selectedOrderFounded);
      }
      setOpen(true);
    },
    [orders?.data]
  );

  const onCloseOrderDetail = useCallback(() => {
    setOpen(false);
    setSelectedOrder(null);
  }, []);

  const onPageChange = useCallback((_event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    console.log('page', page);
    setPagination((prev) => ({ ...prev, page: page + 1 }));
  }, []);

  const onRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPagination((prev) => ({ ...prev, limit: Number(event.target.value) }));
  }, []);

  const columns: TableColumnInterface[] = [
    {
      id: 'id',
      label: '',
      content: (_value: string) => (
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={(event) => {
              if (event.target.checked) {
                selectAll();
              } else {
                deselectAll();
              }
            }}
          />
        </TableCell>
      ),
    },
    {
      id: 'order_number',
      label: 'Mã hoá đơn',
    },
    {
      id: 'buyer_info',
      label: 'Khách hàng',
    },
    {
      id: 'payment_status',
      label: 'Trạng thái',
    },
    {
      id: 'id',
      label: '',
    },
  ];

  const dataFormatted = [
    {
      key: 'id',
      content: (value: number) => {
        const isSelected = selected?.has(value.toString());
        return (
          <TableCell padding="checkbox">
            <Checkbox
              value={value}
              onChange={(event) => {
                if (event.target.checked) {
                  // onSelectProduct(value);
                } else {
                  deselectOne(value.toString());
                }
              }}
              checked={isSelected}
            />
          </TableCell>
        );
      },
    },
    {
      key: 'order_number',
      content: (value: string) => <TableCell>{value}</TableCell>,
    },
    {
      key: 'buyer_info',
      content: (value: UserInterface) => (
        <TableCell>
          <Stack display="flex" flexDirection="row" spacing={1}>
            <Avatar src={value.avatar} alt={value.username} />
            <Stack flexDirection="column">
              <Typography variant="h6">{value.username}</Typography>
              <Typography component="p">{value.email}</Typography>
            </Stack>
          </Stack>
        </TableCell>
      ),
    },
    {
      key: 'payment_status',
      content: (value: TPaymentStatus) => (
        <TableCell>
          <OrderStatus status={value} />
        </TableCell>
      ),
    },
    {
      key: 'id',
      content: (orderId: string) => (
        <TableCell>
          <IconButton
            onClick={() => {
              onOpenOrderDetails(orderId);
            }}
          >
            <RemoveRedEyeIcon />
          </IconButton>
        </TableCell>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          {orders?.data ? (
            <>
              <TableComponent columns={columns} dataFormatted={dataFormatted} filters={[]} data={orders.data} />
              <TablePagination
                component="div"
                count={orders.total}
                page={pagination.page - 1}
                rowsPerPage={pagination.limit}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
              />
            </>
          ) : null}
        </Box>
      </Card>
      {open ? (
        <OrderDetails
          canModify={false}
          open={open}
          onClose={onCloseOrderDetail}
          buyerInfo={selectedOrder?.buyer_info}
          issuedDate={selectedOrder?.issued_date}
          status={selectedOrder?.payment_status}
          productsDisplay={
            selectedOrder?.order_items.map((item) => ({
              id: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
              discount_price: item.product.discount_price,
              title: item.product.title,
              thumbnail: item.product.thumbnail,
            })) || []
          }
        />
      ) : null}
    </>
  );
}
