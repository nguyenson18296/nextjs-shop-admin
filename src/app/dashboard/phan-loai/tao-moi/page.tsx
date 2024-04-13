import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';

import CreateCategoryForm from '@/components/dashboard/categories/create-form';
import CategoriesList from '@/components/dashboard/categories/categories-list';

import { config } from '@/config';

export const metadata = { title: `Tạo mới sản phẩm | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Box>
        <CreateCategoryForm />
        <CategoriesList />
      </Box>
    </Stack>
  )
}
