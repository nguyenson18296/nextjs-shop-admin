/* eslint-disable import/no-named-as-default-member */
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import { type TransitionProps } from '@mui/material/transitions';

import { type ProductOrderType } from './create-order-form';
import { OrderLineItems } from './order-line-items';
import OrderStatus from './order-status';
import { type TPaymentStatus } from '@/api/orders/types';
import type { IBuyerInfo, IOrderItem } from '@/api/orders/types';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<unknown, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface OrderDetailsInterface {
  canModify?: boolean;
  open?: boolean;
  productsDisplay: IOrderItem[];
  buyerInfo?: IBuyerInfo;
  onClose?: () => void;
  issuedDate?: string;
  status?: TPaymentStatus;
}

export function OrderDetails({
  canModify,
  open = false,
  buyerInfo,
  productsDisplay,
  issuedDate,
  onClose,
  status,
}: OrderDetailsInterface): React.JSX.Element {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" TransitionComponent={Transition}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle>Chi tiết đơn mua</DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          <Paper
            sx={{
              border: '1px solid #dcdfe4',
              borderRadius: '8px',
            }}
          >
            <Stack>
              {buyerInfo ? (
                <Box
                  display="grid"
                  padding="12px 24px"
                  gridTemplateColumns="150px minmax(0, 1fr)"
                  alignItems="center"
                  gap={2}
                >
                  <div>Customer</div>
                  <div>{buyerInfo.username}</div>
                </Box>
              ) : null}
              <Divider />
              <Box
                display="grid"
                padding="12px 24px"
                gridTemplateColumns="150px minmax(0, 1fr)"
                alignItems="center"
                gap={2}
              >
                <div>Address</div>
                <div>
                  <Typography variant="h6">1721 Bartlett Avenue Southfield, Michigan, United States 48034</Typography>
                </div>
              </Box>
              <Divider />
              <Box
                display="grid"
                padding="12px 24px"
                gridTemplateColumns="150px minmax(0, 1fr)"
                alignItems="center"
                gap={2}
              >
                <div>Date</div>
                <div>{issuedDate}</div>
              </Box>
              <Divider />
              <Box
                display="grid"
                padding="12px 24px"
                gridTemplateColumns="150px minmax(0, 1fr)"
                alignItems="center"
                gap={2}
              >
                <div>Status</div>
                <div>
                  <OrderStatus status={status} />
                </div>
              </Box>
            </Stack>
          </Paper>
          <OrderLineItems canModify={canModify} productsDisplay={productsDisplay} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
