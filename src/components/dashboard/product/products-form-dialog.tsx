/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useCallback, useEffect, useState } from 'react';
import { type CategoryInterface } from '@/utils/constants';
import { Button, FormControl, FormLabel, IconButton, MenuItem, Select, Stack, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import Alert, { type AlertColor } from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { generateSlug } from '@/utils/format';
import { DialogComponent } from '@/components/Dialog/Dialog';
import { BASE_URL } from '@/utils/constants';
import TextArea from '@/components/TextArea/TextArea';
import { DragDropZone } from '@/components/DragDropZone/DragDropZone';
import { TextEditor } from '@/components/TextEditor/text-editor';

import { type ProductInterface } from './products-table';
import { useAppSelector } from '@/hooks/use-redux';

type TFormInput = ProductInterface;

interface ProductFormDialogInterface {
  open?: boolean;
  handleClose: () => void;
  product?: ProductInterface;
  isEdit?: boolean;
}

export function ProductFormDialog({ open, isEdit = false, handleClose, product }: ProductFormDialogInterface): React.JSX.Element {
  const { handleSubmit, control, getValues, setValue, formState } = useForm<TFormInput>({
    defaultValues: product,
  });
  const categories = useAppSelector(state => state.category.categories);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editState, setEditState] = useState({
    color: '',
    show: false,
    message: ''
  })
  const [content, setContent] = useState('');

  useEffect(() => {
    const { description } = getValues();
    setContent(description)
  }, [getValues]);

  const onSubmit: SubmitHandler<TFormInput> = useCallback(async (submitData: TFormInput) => {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('description', content)
        formData.append('thumbnail', selectedImage);
      }
      for (const key in submitData) {
        const value = submitData[key];
        if (typeof value === 'string') {
          formData.append(key, value);
        } else if (value instanceof Blob) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          formData.append(key, value, value.name);
        }
      }
      // Append all keys and their corresponding values from the data object
      try {
        await fetch(`${BASE_URL}/products`, {
          method: 'POST',
          body: formData,
        });
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
          message: 'Tạo sản phẩm thất bại'
        })
        // Handle upload error
      }
  }, [selectedImage, content]);

  const onEdit: SubmitHandler<TFormInput> = useCallback(
    async (submitData) => {
      // const formData = new FormData();
      // console.log('content', content)
      // if (selectedImage) {
      //   formData.append('thumbnail', selectedImage);
      // }
      submitData.description = content
      // for (const key in submitData) {
      //   const value = submitData[key];
      //   if (typeof value === 'string') {
      //     formData.append(key, value);
      //   } else if (value instanceof Blob) {
      //     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      //     formData.append(key, value, value.name);
      //   }
      // }
      try {
        await fetch(`${BASE_URL}/products/${product?.id.toString() || ''}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
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
    [product?.id, content]
  );

  const genSlug = useCallback(() => {
    const slug = generateSlug(getValues().title);
    setValue('slug', slug);
  }, [setValue, getValues]);

  const onChangeContent = useCallback((contentCb: string) => {
    setContent(contentCb);
  }, []);

  return (
    <DialogComponent open={open} handleClose={handleClose} headerText="Chỉnh sửa sản phẩm">
        <form onSubmit={handleSubmit(isEdit ? onEdit : onSubmit)}>
          <Stack spacing={2}>
            <FormControl>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Không được để trống' }}
                render={({ field }) => <TextField error={Boolean(formState.errors['title'])} label="Tên sản phẩm" {...field} />}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="slug"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Link url"
                    error={Boolean(formState.errors['slug'])}
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
                name='short_description'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextArea
                    error={Boolean(formState.errors['description'])}
                    field={field}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextEditor onChange={onChangeContent} defaultValue={content} />
              {/* <Controller
                name='description'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextArea
                    error={Boolean(formState.errors['description'])}
                    field={field}
                  />
                )}
              /> */}
            </FormControl>
            <FormControl fullWidth>
              <Controller
                name="category.id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select defaultValue={categories ? categories[0].id : null} labelId="demo-simple-select-label" id="demo-simple-select" {...field}>
                    {(categories || []).map((item: CategoryInterface) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <Stack spacing={4}>
              <FormLabel>Hình ảnh sản phẩm:</FormLabel>
              <DragDropZone image={product?.thumbnail} setSelectedImage={setSelectedImage} />
            </Stack>
            <FormControl>
              <Controller
                name="price"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField error={Boolean(formState.errors['price'])} label="Giá gốc" {...field} />}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="discount_price"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TextField error={Boolean(formState.errors['discount_price'])} label="Giá đã giảm" {...field} />}
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
