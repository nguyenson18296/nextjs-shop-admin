/* eslint-disable react/no-unstable-nested-components */
'use client';

import * as React from 'react';
import { Avatar, TableCell } from '@mui/material';
// import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import TablePagination from '@mui/material/TablePagination';
import dayjs from 'dayjs';

import { type TableColumnInterface } from '@/types/common';
import useFetchData from '@/hooks/use-fetch';
import { useSelection } from '@/hooks/use-selection';
import { TableComponent } from '@/components/table/Table';
import { formatVndCurrency } from '@/utils/format';

function noop(): void {
  // do nothing
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
  price: string;
  discount_price: string;
}

export function CustomersTable(): React.JSX.Element {
  const { data: products } = useFetchData<{ data: Product[]; total: number; }>('/products', 'GET');

  const rowIds = React.useMemo(() => {
    return (products?.data || []).map((customer) => customer.id);
  }, [products?.data]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < (products?.data || []).length;
  const selectedAll = (products?.data || []).length > 0 && selected?.size === (products?.data || []).length;

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
      label: 'Ngày tạo sản phẩm'
    }
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
  ];

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        {products?.data ? (
          <TableComponent columns={columns} dataFormatted={dataFormatted} data={products?.data ?? []} />
        ) : null}
        {/* <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Signed Up</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {row.address.city}, {row.address.state}, {row.address.country}
                  </TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table> */}
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
  );
}
