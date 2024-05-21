import React from "react";
import type { Metadata } from "next";
import { Stack, Typography } from "@mui/material";

import { CreateOrderForm } from "@/components/Order/create-order-form";

export const metadata = { title: `Tạo đơn mua` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">
        Tạo đơn mua
        <CreateOrderForm />
      </Typography>
    </Stack>
  )
}
