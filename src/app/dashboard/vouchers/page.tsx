import React from "react";
import type { Metadata } from 'next';

import { Stack } from "@mui/material";

import { config } from '@/config';
import { VoucherActions } from "@/components/dashboard/vouchers/voucher-actions";
import { VouchersTable } from "@/components/dashboard/vouchers/vouchers-table";

export const metadata = { title: `Vouchers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <VoucherActions />
      <VouchersTable />
    </Stack>
  )
}
