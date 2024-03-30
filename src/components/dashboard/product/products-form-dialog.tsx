/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { type CategoryInterface } from '@/utils/constants';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, FormControl, FormLabel, IconButton, MenuItem, Select, Stack, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import Alert, { type AlertColor } from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { generateSlug } from '@/utils/format';

import useFetchData from '@/hooks/use-fetch';
import { DialogComponent } from '@/components/Dialog/Dialog';

import { type ProductInterface } from './products-table';

type TFormInput = ProductInterface;

interface ProductFormDialogInterface {
  open?: boolean;
  handleClose: () => void;
  product: TFormInput;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export function ProductFormDialog({ open, handleClose, product }: ProductFormDialogInterface): React.JSX.Element {
  const { handleSubmit, control, getValues, setValue } = useForm<TFormInput>({
    defaultValues: product,
  });
  const { data: categories } = useFetchData<CategoryInterface[]>(`/categories`);

  const [thumbnail, setThumbnail] = useState(product.thumbnail);
  // const [_selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editState, setEditState] = useState({
    color: '',
    show: false,
    message: ''
  })

  const onUploadNewThumbnail = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event?.target?.files[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setThumbnail(objectUrl);
        // setSelectedImage(file);
      }
    }
  }, []);

  const onSubmit: SubmitHandler<TFormInput> = useCallback(
    async (submitData) => {
      // Append all keys and their corresponding values from the data object
      try {
        const response = await fetch(`http://localhost:1996/products/${product.id.toString()}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
        const data = await response.json();
        setEditState({
          color: 'success',
          show: true,
          message: 'Cập nhật sản phẩm thành công'
        })
        // Handle the response from the API
      } catch (error) {
        setEditState({
          color: 'error',
          show: true,
          message: 'Cập nhật sản phẩm thất bại'
        })
        // Handle upload error
      }
    },
    [product.id]
  );

  const genSlug = useCallback(() => {
    const slug = generateSlug(getValues().title);
    setValue('slug', slug);
  }, [setValue, getValues]);

  return (
    <DialogComponent open={open} handleClose={handleClose} headerText="Chỉnh sửa sản phẩm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <FormControl>
              <Controller
                name="title"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField label="Tên sản phẩm" {...field} />}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Link url"
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={genSlug} aria-label='gen-slug' color='primary'>
                          <AddBoxIcon />
                        </IconButton>
                      )
                    }}
                    {...field}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <Controller
                name="category.id"
                control={control}
                render={({ field }) => (
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" {...field}>
                    {(categories || []).map((item: CategoryInterface) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <Stack spacing={2}>
              <FormLabel>Hình ảnh sản phẩm:</FormLabel>
              <Image
                src={thumbnail}
                alt={product.title}
                width={200}
                height={200}
                style={{
                  border: '1px solid gray',
                }}
              />
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={onUploadNewThumbnail} />
              </Button>
            </Stack>
            <FormControl>
              <Controller
                name="price"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField label="Giá gốc" {...field} />}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="discount_price"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField label="Giá đã giảm" {...field} />}
              />
            </FormControl>
          </Stack>
          <DialogActions>
            <Button type="submit" variant="contained">
              Sửa
            </Button>
            <Button variant="outlined">Huỷ</Button>
          </DialogActions>
          {editState.show ? <Alert icon={<CheckIcon fontSize="inherit" />} severity={editState.color as AlertColor}>
            {editState.message}
          </Alert> : null}
        </form>
      </DialogComponent>
  );
}
