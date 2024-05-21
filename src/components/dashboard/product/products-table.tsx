/* eslint-disable react/no-unstable-nested-components */
'use client';

import * as React from 'react';
import { BASE_URL, type CategoryInterface } from '@/utils/constants';
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
import { getCategories } from '@/lib/store/categories.slice';
import { updateNewNotification, type NotificationInterface } from '@/lib/store/notifications.slice';
import useFetchData from '@/hooks/use-fetch';
import { useAppDispatch } from '@/hooks/use-redux';
import { useSelection } from '@/hooks/use-selection';
import { TableComponent, type FilterItem } from '@/components/table/Table';

import { ProductFormDialog } from './products-form-dialog';

function noop(): void {
  // do nothing
}

interface ProductsTableInterface {
  setSelectedProductsProps: (products: ProductInterface[]) => void;
}

export interface ProductInterface {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  short_description: string;
  description: string;
  price: string;
  discount_price: string;
  category?: CategoryInterface;
}

export function ProductsTable({ setSelectedProductsProps }: ProductsTableInterface): React.JSX.Element {
  const { data: products } = useFetchData<{ data: ProductInterface[]; total: number }>('/products', 'GET');
  const { data: categories } = useFetchData<CategoryInterface[]>('/categories', 'GET');
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<ProductInterface>();
  const [selectedProducts, setSelectedProducts] = React.useState<ProductInterface[]>([]);
  const [activeTabFilter, setActiveTabFilter] = React.useState(0);
  const [tabsFilter, setTabsFilter] = React.useState<FilterItem[]>([]);

  const dispatch = useAppDispatch();

  const rowIds = React.useMemo(() => {
    return (products?.data || []).map((product) => product.id);
  }, [products?.data]);

  React.useEffect(() => {
    if (!categories || categories.length === 0) return;

    const allFilter: FilterItem = {
      id: 0,
      label: 'Tất cả',
      count: products?.data.length || 0,
    };

    const otherFilter: FilterItem = {
      id: Infinity,
      label: 'Khác',
      count: products?.data.filter((item) => !item.category).length || 0,
    };

    const newCategories: FilterItem[] = categories.map((item) => ({
      id: item.id,
      label: item.title,
      count: 0,
    }));

    if (products && products.data.length > 0) {
      for (const product of products.data) {
        const category = product.category?.id;
        const foundCategory = newCategories.find((item) => item.id === category);
        if (foundCategory) {
          foundCategory.count += 1;
        }
      }
    }

    const newTabsFilter = [...newCategories, allFilter, otherFilter].sort((a, b) => a.id - b.id);
    setTabsFilter(newTabsFilter);
    setActiveTabFilter(newTabsFilter[0].id);
  }, [categories, products]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < (products?.data || []).length;
  const selectedAll = (products?.data || []).length > 0 && selected?.size === (products?.data || []).length;

  React.useEffect(() => {
    dispatch(getCategories(categories || []));
  }, [categories, dispatch]);

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

  const onSelectProduct = React.useCallback(
    (value: number) => {
      selectOne(value);
      let cloneArr = [...selectedProducts];
      if (cloneArr.map((item) => item.id).includes(value)) {
        cloneArr = cloneArr.filter((product) => product.id !== value);
      } else {
        const product = products?.data.find((product) => product.id === value);
        if (product) {
          cloneArr = cloneArr.concat(product);
        }
      }
      setSelectedProducts(cloneArr);
    },
    [selectOne, products, selectedProducts]
  );

  React.useEffect(() => {
    if (selectedProducts) {
      setSelectedProductsProps(selectedProducts);
    }
  }, [selectedProducts, setSelectedProductsProps]);

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
      id: 'category',
      label: 'Phân loại',
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
                  onSelectProduct(value);
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
      key: 'category',
      content: (value: CategoryInterface) => {
        const data = value?.title || '';
        return <TableCell>{data}</TableCell>;
      },
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

  const onSwitchFilterTab = React.useCallback((id: number) => {
    setActiveTabFilter(id);
  }, []);

  const dataFiltered = React.useMemo(() => {
    if (activeTabFilter > 0 && activeTabFilter !== Infinity) {
      return products?.data.filter((data) => data.category?.id === activeTabFilter);
    } else if (activeTabFilter === Infinity) {
      return products?.data.filter((data) => !data.category);
    }
    return products?.data;
  }, [activeTabFilter, products?.data]);

  return (
    <>
      {selectedProduct && openEdit ? (
        <ProductFormDialog isEdit open={openEdit} handleClose={handleCloseModal} product={selectedProduct} />
      ) : null}
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          {products?.data ? (
            <TableComponent
              columns={columns}
              dataFormatted={dataFormatted}
              data={dataFiltered || []}
              filters={tabsFilter}
              activeFilter={activeTabFilter}
              onSwitchFilterTab={onSwitchFilterTab}
            />
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
