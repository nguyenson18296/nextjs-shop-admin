import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/product/customers-filters';
import { CustomersTable } from '@/components/dashboard/product/products-table';
import { ProductActions } from '@/components/dashboard/product/product-actions';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
     <ProductActions />
      <CustomersFilters />
      <CustomersTable />
    </Stack>
  );
}
