'use client';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { BASE_URL, type CategoryInterface } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PartyModeIcon from '@mui/icons-material/PartyMode';
import {
  Alert,
  type AlertColor,
  Avatar,
  Box,
  Button,
  CardContent,
  FormControl,
  FormHelperText,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { useAppDispatch } from '@/hooks/use-redux';
import { addCategory } from '@/lib/store/categories.slice';

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

const schema = zod.object({
  title: zod.string().min(1, { message: 'Required' }),
});

type Values = zod.infer<typeof schema>;

export default function CreateCategoryForm(): React.JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState('');
  const [submitState, setSubmitState] = useState<{
    color: AlertColor;
    show: boolean;
    message: string;
  }>({
    color: 'success',
    show: false,
    message: '',
  });
  const dispatch = useAppDispatch();

  const onUploadNewThumbnail = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event?.target?.files[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setThumbnail(objectUrl);
        setSelectedImage(file);
      }
    }
  }, []);

  const onSubmit = useCallback(async (data: Values) => {
    const formData = new FormData();
    if (selectedImage) {
      formData.append('thumbnail', selectedImage);
    }
    for (const key in data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = data[key];
      if (typeof value === 'string') {
        formData.append(key, value);
      } else if (value instanceof Blob) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        formData.append(key, value, value.name);
      }
    }
    try {
      const response = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        body: formData,
      });
      const dataResponse = await response.json() as CategoryInterface;
      dispatch(addCategory(dataResponse))
      setSubmitState({
        color: 'success',
        message: 'Tạo Category Thành công',
        show: true,
      });
    } catch (e) {
      setSubmitState({
        color: 'error',
        message: 'Tạo Category thất bại',
        show: true,
      });
    }
  }, [selectedImage]);

  return (
    <>
      <Stack>
        <Typography variant="h4" gutterBottom>
          Tạo mới phân loại sản phẩm
        </Typography>
      </Stack>
      <Card sx={{ minWidth: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Thông tin Category
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  border: '1px dashed #dcdfe4',
                  borderRadius: '50%',
                }}
              >
                {thumbnail.length > 0 ? (
                  <Image src={thumbnail} alt="category-img" width={100} height={100} />
                ) : (
                  <Avatar
                    sx={{
                      height: '100px',
                      width: '100px',
                      borderRadius: '50%',
                      userSelect: 'none',
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#f9fafb',
                      alignItems: 'center',
                    }}
                  >
                    <PartyModeIcon color="warning" />
                  </Avatar>
                )}
              </Box>
              <Stack>
                <Typography variant="h6" gutterBottom>
                  Hình ảnh
                </Typography>
                <Typography
                  className=".MuiTypography-caption"
                  sx={{
                    fontSize: '0.75rem',
                    lineHeight: '1.66',
                  }}
                >
                  Min 400x400px, PNG or JPEG
                </Typography>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    width: '140px',
                    marginTop: '16px',
                  }}
                >
                  Upload file
                  <VisuallyHiddenInput type="file" onChange={onUploadNewThumbnail} />
                </Button>
              </Stack>
            </Stack>
            <Stack
              sx={{
                marginTop: '32px',
              }}
            >
              <Controller
                control={control}
                name="title"
                render={(({ field }) => (
                  <FormControl error={Boolean(errors.title)}>
                    <TextField id="outlined-multiline-flexible" label="Tên Category" {...field} />
                    {errors.title ? <FormHelperText>{errors.title.message}</FormHelperText> : null}
                  </FormControl>
                ))}
              />
            </Stack>
            <Button
              variant="contained"
              sx={{
                marginTop: '16px',
              }}
              type='submit'
            >
              Tạo Category
            </Button>
          </form>
          {submitState.show ? (
            <Alert sx={{ marginTop: '16px' }} variant="filled" severity={submitState.color}>
              {submitState.message}
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
