import React, { useMemo } from "react"
import {
  Box,
  Divider,
  Stack,
  Typography,
  FormHelperText
} from '@mui/material';
import { type FieldErrors } from "react-hook-form";

import { ProductOrderItems } from "./product-order-item";
import { type ProductOrderType, type FormInputInterface } from "./create-order-form";

interface OrderLineItemsInterface {
  canModify?: boolean;
  productsDisplay: ProductOrderType[];
  setProductDisplay?: React.Dispatch<React.SetStateAction<ProductOrderType[]>>;
  errors?: FieldErrors<FormInputInterface>
}

export function OrderLineItems({
  canModify = true,
  errors,
  setProductDisplay,
  productsDisplay
}: OrderLineItemsInterface): React.JSX.Element {

  console.log('productsDisplay', productsDisplay);

  const subTotal = useMemo(
    () => productsDisplay.reduce((partialSum, { price }) => partialSum + Number(price), 0),
    [productsDisplay]
  );
  const subTotalDiscount = useMemo(
  // eslint-disable-next-line camelcase
    () => productsDisplay.reduce((partialSum, { discount_price }) => partialSum + Number(discount_price), 0),
    [productsDisplay]
  );

  return (
    <Stack spacing={2}>
      <Stack spacing={3}>
        <Typography component="h6">Danh sách sản phẩm</Typography>
        <ProductOrderItems canModify={canModify} productsDisplay={productsDisplay} setProductDisplay={setProductDisplay} />
        {errors?.products ? <FormHelperText error>
            {errors?.['products'].message}
          </FormHelperText> : null}
      </Stack>
      <Divider />
      <Box display="flex" justifyContent="flex-end">
        <Stack spacing={2} width={300} flexDirection="column">
          <Stack display="flex" flexDirection="row" justifyContent="space-between">
            <Typography component="p">Subtotal</Typography>
            <Typography component="p">{subTotal}</Typography>
          </Stack>
          <Stack display="flex" flexDirection="row" justifyContent="space-between">
            <Typography component="p">Discount</Typography>
            <Typography component="p">{subTotalDiscount}</Typography>
          </Stack>
          <Stack display="flex" flexDirection="row" justifyContent="space-between">
            <Typography component="p">Shipping</Typography>
            <Typography component="p">-</Typography>
          </Stack>
          <Stack display="flex" flexDirection="row" justifyContent="space-between">
            <Typography component="p">Taxes</Typography>
            <Typography component="p">-</Typography>
          </Stack>
          <Stack display="flex" flexDirection="row" justifyContent="space-between">
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">{subTotalDiscount}</Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}