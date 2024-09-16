'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDeleteVoucher, useVouchers, type IVoucher } from '@/api/vouchers';
import { Box, Card, Chip, IconButton, Stack, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';
import { CheckCircle, PencilSimple, Trash, XCircle } from '@phosphor-icons/react';
import { ColumnDef, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import dayjs from 'dayjs';

import { DialogComponent } from '@/components/Dialog/Dialog';
import { useSnackbar } from '@/contexts/use-snackbar-context';
import { VoucherFormDialog } from './voucher-form';

export function VouchersTable(): React.JSX.Element {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);
  const [openEditVoucher, setOpenEditVoucher] = React.useState(false);
  const [selectedVoucher, setSelectedVoucher] = React.useState<IVoucher | undefined>(undefined);

  const [selectedDeletedVoucher, setSelectedDeletedVoucher] = React.useState<IVoucher['id'] | null>(null);
  const { showSnackbar } = useSnackbar();

  const queryString = useMemo(() => {
    return `page=${pagination.page}`
  }, [pagination.page]);

  const { data: vouchers } = useVouchers(queryString);
  const { mutate: deleteVoucher, isPending: isPendingDelete, isSuccess } = useDeleteVoucher();


  const columns: ColumnDef<IVoucher>[] = [
    {
      accessorKey: 'id',
      header: 'id',
      cell: () => <div />,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'code',
      header: 'Mã',
      cell: ({ row }) => row.getValue('code'),
      enableSorting: false,
    },
    {
      accessorKey: 'discount_value',
      header: 'Giảm giá',
      cell: ({ row }) => row.getValue('discount_value'),
      enableSorting: true,
    },
    {
      accessorKey: 'valid_from',
      header: 'Ngày bắt đầu',
      cell: ({ row }) => dayjs(row.getValue('valid_from')).format('DD-MM-YYYY'),
      enableSorting: true,
    },
    {
      accessorKey: 'valid_to',
      header: 'Ngày kết thúc',
      cell: ({ row }) => dayjs(row.getValue('valid_to')).format('DD-MM-YYYY'),
      enableSorting: true,
    },
    {
      accessorKey: 'usage_limit',
      header: 'Số lần sử dụng',
      cell: ({ row }) => row.getValue('usage_limit'),
      enableSorting: true,
    },
    {
      accessorKey: 'is_active',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active');
        return (
          <Chip
            icon={isActive ? <CheckCircle /> : <XCircle />}
            label={isActive ? 'Hoạt động' : 'Không hoạt động'}
            color={isActive ? 'success' : 'error'}
          />
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Stack direction="row">
          <IconButton onClick={() => handleOpenEditVoucher(row.original.id)} aria-label="Edit" color="info">
            <PencilSimple />
          </IconButton>
          <IconButton
            onClick={() => {
              handleOpenPopupConfirmDelete();
              setSelectedDeletedVoucher(row.original.id);
            }}
            aria-label="Delete"
            color="error"
          >
            <Trash />
          </IconButton>
        </Stack>
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: vouchers?.data || [],
    columns,
    pageCount: vouchers?.total || 0,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      },
      columnVisibility: {
        id: false,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const onDeleteVoucher = useCallback(() => {
    if (selectedDeletedVoucher) {
      deleteVoucher(selectedDeletedVoucher);
    }
  }, [selectedDeletedVoucher]);

  const handleOpenPopupConfirmDelete = useCallback(() => {
    setOpenConfirmDelete(true);
  }, []);

  const handleClosePopupConfirmDelete = useCallback(() => {
    setOpenConfirmDelete(false);
  }, []);

  const handleOpenEditVoucher = useCallback((id: string) => {
    setOpenEditVoucher(true);
    setSelectedVoucher(vouchers?.data.find((voucher: IVoucher) => voucher.id === id) || null);
  }, [vouchers]);

  useEffect(() => {
    if (isSuccess) {
      showSnackbar('Xóa voucher thành công', 'success');
      handleClosePopupConfirmDelete();
    }
  }, [isSuccess, handleClosePopupConfirmDelete]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage + 1,
    }));
  };

  console.log('pagination', pagination);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {openEditVoucher && (
        <VoucherFormDialog
          open={openEditVoucher}
          handleClose={() => setOpenEditVoucher(false)}
          voucher={selectedVoucher}
        />
      )}
      <DialogComponent
        open={openConfirmDelete}
        handleClose={handleClosePopupConfirmDelete}
        headerText="Xác nhận xóa voucher"
        submitButtonText='Xóa'
        onSubmit={onDeleteVoucher}
        isLoading={isPendingDelete}
        isConfirmPopup
      >
        <Stack spacing={2}>
          <p>Bạn có chắc chắn muốn xóa voucher này không?</p>
        </Stack>
      </DialogComponent>
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                {table.getHeaderGroups().map((headerGroup) => (
                  <React.Fragment key={headerGroup.id}>
                    {headerGroup.headers.map((column) => (
                      <TableCell key={column.id}>
                        {flexRender(column.column.columnDef.header, column.getContext())}
                      </TableCell>
                    ))}
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
            {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  count={vouchers?.total || 0}
                  rowsPerPage={rowsPerPage}
                  page={pagination.page - 1}
                  slotProps={{
                    select: {
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
          {/* <TableComponent /> */}
        </Box>
      </Card>
    </>
  );
}
