"use client"
import React, { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import Link from 'next/link';

export function OrderActions(): React.JSX.Element {
    return (
        <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Đơn mua</Typography>
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
              <Link href="/dashboard/don-mua/create">
                <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
                  Tạo mới đơn mua
              </Button>
              </Link>
            </div>
        </Stack>
    )
}
