/* eslint-disable react/no-unstable-nested-components */
'use client';

import * as React from 'react';
import { formatVndCurrency } from '@/utils/format';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, TableCell } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import { pink } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import TablePagination from '@mui/material/TablePagination';
import dayjs from 'dayjs';
import io from 'socket.io-client';

import { type TableColumnInterface } from '@/types/common';
import useFetchData from '@/hooks/use-fetch';
import { useSelection } from '@/hooks/use-selection';
import { TableComponent } from '@/components/table/Table';
import { ProductFormDialog } from './products-form-dialog';
import { BASE_URL, type CategoryInterface } from '@/utils/constants';
import { useAppDispatch } from '@/hooks/use-redux';
import { updateNewNotification, type NotificationInterface } from '@/lib/store/notifications.slice';

function noop(): void {
  // do nothing
}

export interface ProductInterface {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
  price: string;
  discount_price: string;
  category?: CategoryInterface;
}

export function CustomersTable(): React.JSX.Element {
  const { data: products } = useFetchData<{ data: ProductInterface[]; total: number }>('/products', 'GET');
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<ProductInterface>();
  const dispatch = useAppDispatch();

  const rowIds = React.useMemo(() => {
    return (products?.data || []).map((customer) => customer.id);
  }, [products?.data]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < (products?.data || []).length;
  const selectedAll = (products?.data || []).length > 0 && selected?.size === (products?.data || []).length;

  React.useEffect(() => {
    // Initialize WebSocket connection
    const socket = io(BASE_URL); // Use your server's address
    
    // Setup event listener for 'notification' events
    socket.on('notificationToClient', (notificationData: NotificationInterface) => {
      dispatch(updateNewNotification(notificationData));
      // Handle notification data (e.g., display a notification)
    });

    // Cleanup on component unmount
    return () => {
      socket.off('notification');
      socket.close();
    };
  }, [dispatch]); // Empty dependency array means this effect runs once on mount

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
      id: 'title',
      label: 'Tên sản phẩm',
    },
    {
      id: 'slug',
      label: 'Slug',
    },
    {
      id: 'thumbnail',
      label: 'Hình ảnh',
    },
    {
      id: 'price',
      label: 'Giá gốc',
    },
    {
      id: 'discount_price',
      label: 'Giá đã giảm',
    },
    {
      id: 'created_at',
      label: 'Ngày tạo sản phẩm',
    },
    {
      id: 'action',
      label: 'Thao tác',
    },
  ];

  const dataFormatted = [
    {
      key: 'id',
      content: (value: number) => {
        const isSelected = selected?.has(value);
        return (
          <TableCell padding="checkbox">
            <Checkbox
              value={value}
              onChange={(event) => {
                if (event.target.checked) {
                  selectOne(value);
                } else {
                  deselectOne(value);
                }
              }}
              checked={isSelected}
            />
          </TableCell>
        );
      },
    },
    {
      key: 'title',
      content: (value: string) => <TableCell>{value}</TableCell>,
    },
    {
      key: 'slug',
      content: (value: string) => <TableCell>{value}</TableCell>,
    },
    {
      key: 'thumbnail',
      content: (value: string, title: string) => (
        <TableCell>
          <Avatar src={value} alt={title} />
        </TableCell>
      ),
    },
    {
      key: 'price',
      content: (value: string) => <TableCell>{formatVndCurrency(Number(value))}</TableCell>,
    },
    {
      key: 'discount_price',
      content: (value: string) => <TableCell>{formatVndCurrency(Number(value))}</TableCell>,
    },
    {
      key: 'created_at',
      content: (value: string) => <TableCell>{dayjs(value).format('MMM D, YYYY')}</TableCell>,
    },
    {
      key: 'actions',
      content: (value: string, id: number) => (
        <TableCell sx={{ display: 'flex' }}>
          <IconButton
            aria-label="edit"
            onClick={() => {
              onSelectedProduct(id);
            }}
          >
            <EditIcon color="primary" />
          </IconButton>
          <IconButton aria-label="delete">
            <DeleteIcon sx={{ color: pink[500] }} />
          </IconButton>
        </TableCell>
      ),
    },
  ];

  const handleCloseModal = React.useCallback(() => {
    setOpenEdit(false);
  }, []);

  const onSelectedProduct = React.useCallback(
    (productId: number) => {
      setOpenEdit(true);
      const foundProduct = products?.data.find((item) => item.id === productId);
      if (foundProduct) {
        setSelectedProduct(foundProduct);
      }
    },
    [products?.data]
  );

  return (
    <>
      {selectedProduct && openEdit ? (
        <ProductFormDialog isEdit open={openEdit} handleClose={handleCloseModal} product={selectedProduct} />
      ) : null}
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          {products?.data ? (
            <TableComponent columns={columns} dataFormatted={dataFormatted} data={products?.data ?? []} />
          ) : null}
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={products?.total ?? 0}
          onPageChange={noop}
          onRowsPerPageChange={noop}
          page={0}
          rowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </>
  );
}
