import React, { useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { DialogComponent } from '@/components/Dialog/Dialog';
import { useSnackbar } from '@/contexts/use-snackbar-context';
import { useCreateVoucher, useUpdateVoucher, schema, IVoucher } from '@/api/vouchers';

const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

interface IVoucherFormProps {
  open?: boolean;
  handleClose: () => void;
  voucher?: IVoucher;
}

type Values = z.infer<typeof schema>;

export function VoucherFormDialog({ open, handleClose, voucher }: IVoucherFormProps): React.JSX.Element {
  const {
    control,
    formState: { isValid, errors },
    watch,
    setValue,
    handleSubmit,
    reset,
  } = useForm<Values>({
    mode: 'all',
    defaultValues: {
      ...voucher,
      valid_from: dayjs(voucher?.valid_from),
      valid_to: dayjs(voucher?.valid_to),
    },
    // resolver: zodResolver(schema),
  });

  const { mutate, isPending, isSuccess } = useCreateVoucher();
  const { mutate: updateVoucher, isSuccess: isUpdateSuccess } = useUpdateVoucher();
  const { showSnackbar } = useSnackbar();

  const isEditForm = Boolean(voucher);

  const fromDate = watch('valid_from');

  const onChangeFromDate = useCallback(
    (value: any) => {
      setValue('valid_from', value);
    },
    [setValue]
  );

  const onChangeToDate = useCallback(
    (value: any) => {
      setValue('valid_to', value);
    },
    [setValue]
  );

  const onSubmit = useCallback((data: Values) => {
    const formData: Values = {
      ...data,
      valid_from: dayjs(data.valid_from).format('YYYY-MM-DD'),
      valid_to: dayjs(data.valid_to).format('YYYY-MM-DD'),
    };
    if (isEditForm) {
      updateVoucher({
        id: voucher?.id,
        ...formData
      });
      return;
    } else {
      mutate(formData);
    }
  }, [isEditForm, voucher]);

  useEffect(() => {
    if (isSuccess || isUpdateSuccess) {
      reset();
      handleClose();
      showSnackbar(isEditForm ? 'Cập nhật voucher thành công' : 'Tạo voucher thành công', 'success');
    }
  }, [handleClose, isEditForm, reset, isSuccess]);

  return (
    <DialogComponent open={open} handleClose={handleClose} headerText="Tạo Voucher">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <FormControl>
            <Controller
              control={control}
              name="code"
              render={({ field }) => <TextField label="Mã voucher" {...field} />}
            />
          </FormControl>
          <FormControl>
            <Controller
              control={control}
              name="discount_value"
              render={({ field }) => (
                <TextField
                  // error={Boolean(errors.discount_value)}
                  // helperText={errors.discount_value?.message}
                  label="Giá trị"
                  {...field}
                />
              )}
            />
          </FormControl>
          <FormControl>
            <Stack direction="row" spacing={2}>
              <Controller
                name="valid_from"
                control={control}
                render={({ field }) => <DatePicker label="Ngày bắt đầu" {...field} onChange={onChangeFromDate} />}
              />
              <Controller
                name="valid_to"
                control={control}
                render={({ field }) => (
                  <DatePicker label="Ngày bắt đầu" minDate={fromDate} {...field} onChange={onChangeToDate} />
                )}
              />
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Trạng thái hoạt động</FormLabel>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <RadioGroup aria-label="status" sx={{ flexDirection: 'row' }} {...field}>
                  <FormControlLabel value={true} control={<Radio />} label="Hoạt động" />
                  <FormControlLabel value={false} control={<Radio />} label="Không hoạt động" />
                </RadioGroup>
              )}
            />
          </FormControl>
          <FormControl>
            <Controller
              control={control}
              name="usage_limit"
              render={({ field }) => <TextField label="Số lượng" type="number" {...field} />}
            />
          </FormControl>
          <Button disabled={isPending} type="submit" variant="contained">
            Tạo Voucher
          </Button>
        </Stack>
      </form>
    </DialogComponent>
  );
}
