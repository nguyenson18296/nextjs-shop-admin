import React, { memo, useMemo } from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Chip } from "@mui/material";

export type TPaymentStatus = 'COMPLETED' | 'PENDING' | 'CANCELED' | 'REJECTED';

interface OrderStatusInterface {
  status?: TPaymentStatus;
}

function OrderStatus({ status }: OrderStatusInterface): React.JSX.Element {
  const IConPaymentStatus = useMemo(() => {
    switch (status) {
      case 'REJECTED':
        return <ThumbDownIcon />;
      case 'COMPLETED':
        return <CheckCircleIcon color="success" />;
      case 'CANCELED':
        return <CancelIcon />;
      default:
        return <AccessTimeIcon color="warning" />;
    }
  }, [status]);

  return <Chip icon={IConPaymentStatus} variant="outlined" label={status} />;
}

export default memo(OrderStatus)
