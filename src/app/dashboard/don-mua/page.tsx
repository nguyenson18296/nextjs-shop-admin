import React from "react";
import { Stack } from "@mui/material";

import { OrdersTable } from "@/components/Order/orders-table";
import { OrderActions } from "@/components/Order/order-actions";

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <OrderActions />
      <OrdersTable />
    </Stack>
  )
}
