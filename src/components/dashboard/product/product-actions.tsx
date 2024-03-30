"use client"
import React, { useState, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { ProductFormDialog } from '@/components/dashboard/product/products-form-dialog';

export function ProductActions(): React.JSX.Element {
    const [openCreate, setOpenCreate] = useState(false);

  const handleClose = useCallback(() => {
    setOpenCreate(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpenCreate(true);
  }, []);

    return (
        <>
        {openCreate ? <ProductFormDialog open={openCreate} handleClose={handleClose} /> : null}
        <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Sản phẩm</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                Import
                </Button>
                <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                Export
                </Button>
            </Stack>
            </Stack>
            <div>
            <Button onClick={handleOpen} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
                Thêm mới sản phẩm
            </Button>
            </div>
        </Stack>
        </>
    )
}