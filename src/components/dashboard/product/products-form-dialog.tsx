/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useCallback, useEffect, useState } from 'react';
import { BASE_URL, type CategoryInterface } from '@/utils/constants';
import { generateSlug } from '@/utils/format';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CheckIcon from '@mui/icons-material/Check';
import { Button, FormControl, FormLabel, IconButton, MenuItem, Select, Stack, TextField } from '@mui/material';
import Alert, { type AlertColor } from '@mui/material/Alert';
import DialogActions from '@mui/material/DialogActions';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { useAppSelector } from '@/hooks/use-redux';
import { DialogComponent } from '@/components/Dialog/Dialog';
import { DragDropZone } from '@/components/DragDropZone/DragDropZone';
import TextArea from '@/components/TextArea/TextArea';
import { TextEditor } from '@/components/TextEditor/text-editor';

import { type ProductInterface } from './products-table';

type TFormInput = ProductInterface;

interface ProductFormDialogInterface {
  open?: boolean;
  handleClose: () => void;
  product?: ProductInterface;
  isEdit?: boolean;
}

export function ProductFormDialog({
  open,
  isEdit = false,
  handleClose,
  product,
}: ProductFormDialogInterface): React.JSX.Element {
  const { handleSubmit, control, getValues, setValue, formState } = useForm<TFormInput>({
    defaultValues: product,
  });
  const categories = useAppSelector((state) => state.category.categories);

  const [selectedImage, setSelectedImage] = useState<File[] | null>([]);
  const [selectedSubImages, setSelectedSubImages] = useState<File[] | null>([]);
  const [editState, setEditState] = useState({
    color: '',
    show: false,
    message: '',
  });
  const [content, setContent] = useState('');

  useEffect(() => {
    const description = getValues("description");
    setContent(description);
  }, [getValues]);

  const onSubmit: SubmitHandler<TFormInput> = useCallback(
    async (submitData: TFormInput) => {
      const formData = new FormData();
      formData.append('description', content);
      if (selectedImage) {
        formData.append('thumbnail', selectedImage[0]);
        selectedSubImages?.forEach((image) => {
          formData.append('images', image);
        })
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
          message: 'Cập nhật sản phẩm thành công',
        });
        handleClose();
        // Handle the response from the API
      } catch (error) {
        setEditState({
          color: 'error',
          show: true,
          message: 'Tạo sản phẩm thất bại',
        });
        // Handle upload error
      }
    },
    [selectedImage, selectedSubImages, content, handleClose]
  );

  const onEdit: SubmitHandler<TFormInput> = useCallback(
    async (submitData) => {
      // const formData = new FormData();
      // formData.append('description', content);
      // if (selectedImage) {
      //   formData.append('thumbnail', selectedImage[0]);
      // }
      // if (selectedSubImages && selectedSubImages?.length > 0) {
      //   selectedSubImages.forEach((image) => {
      //     formData.append('images', image);
      //   });
      // }
      // for (const key in submitData) {
      //   const value = submitData[key];
      //   if (typeof value === 'string') {
      //     formData.append(key, value);
      //   } else if (value instanceof Blob) {
      //     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      //     formData.append(key, value, value.name);
      //   }
      // }
      const formData = {
        ...submitData,
        description: content,
      }

      try {
        await fetch(`${BASE_URL}/products/${product?.id.toString() || ''}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setEditState({
          color: 'success',
          show: true,
          message: 'Cập nhật sản phẩm thành công',
        });
        handleClose();
        // Handle the response from the API
      } catch (error) {
        setEditState({
          color: 'error',
          show: true,
          message: 'Cập nhật sản phẩm thất bại',
        });
        // Handle upload error
      }
    },
    [product?.id, selectedImage, selectedSubImages, content, handleClose]
  );

  console.log('form', formState.errors);

  const genSlug = useCallback(() => {
    const slug = generateSlug(getValues().title);
    setValue('slug', slug);
  }, [setValue, getValues]);

  const onChangeContent = useCallback((contentCb: string) => {
    setContent(contentCb);
  }, []);

  const onChangeCategory = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('event', event.target.value)
    setValue('category.id', +event.target.value);
  }, [setValue])

  return (
    <DialogComponent open={open} handleClose={handleClose} headerText="Chỉnh sửa sản phẩm">
      <form onSubmit={handleSubmit(isEdit ? onEdit : onSubmit)}>
        <Stack spacing={2}>
          <FormControl>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Không được để trống' }}
              render={({ field }) => (
                <TextField error={Boolean(formState.errors['title'])} label="Tên sản phẩm" {...field} />
              )}
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
                      <IconButton onClick={genSlug} aria-label="gen-slug" color="primary">
                        <AddBoxIcon />
                      </IconButton>
                    ),
                  }}
                  {...field}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <Controller
              name="short_description"
              control={control}
              rules={{ required: true }}
              // render={({ field }) => <BaseTextareaAutosize {...field} /> }
              render={({ field }) => <TextArea props={field} />}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextEditor onChange={onChangeContent} defaultValue={content} />
          </FormControl>
          <FormControl fullWidth>
            <Controller
              name="category.id"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  defaultValue={categories ? categories[0].id : product?.category?.id}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  {...field}
                  onChange={onChangeCategory}
                >
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
            <DragDropZone images={[product?.thumbnail]} setSelectedImages={setSelectedImage as React.Dispatch<React.SetStateAction<File | null>>} />
          </Stack>
          <Stack spacing={4}>
            <FormLabel>Hình ảnh phụ của sản phẩm:</FormLabel>
            <DragDropZone allowMultiple images={product?.images || []} setSelectedImages={setSelectedSubImages} />
          </Stack>
          <FormControl>
            <Controller
              name="price"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField error={Boolean(formState.errors['price'])} label="Giá gốc" {...field} />
              )}
            />
          </FormControl>
          <FormControl>
            <Controller
              name="discount_price"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField error={Boolean(formState.errors['discount_price'])} label="Giá đã giảm" {...field} />
              )}
            />
          </FormControl>
        </Stack>
        <DialogActions>
          <Button type="submit" disabled={!formState.isValid} variant="contained">
            Sửa
          </Button>
          <Button variant="outlined">Huỷ</Button>
        </DialogActions>
        {editState.show ? (
          <Alert icon={<CheckIcon fontSize="inherit" />} severity={editState.color as AlertColor}>
            {editState.message}
          </Alert>
        ) : null}
      </form>
    </DialogComponent>
  );
}
