'use client';

import React, { useCallback, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { VoucherFormDialog } from '@/components/dashboard/vouchers/voucher-form';

export function VoucherActions(): React.JSX.Element {
  const [openCreate, setOpenCreate] = useState(false);

  const handleOpen = useCallback(() => {
    setOpenCreate(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpenCreate(false);
  }, []);

  return (
    <>
      {openCreate && (
        <VoucherFormDialog open={openCreate} handleClose={handleClose} />
      )}
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Vouchers</Typography>
        </Stack>
        <div>
          <Button onClick={handleOpen} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Thêm mới voucher
          </Button>
        </div>
      </Stack>
    </>
  );
}
