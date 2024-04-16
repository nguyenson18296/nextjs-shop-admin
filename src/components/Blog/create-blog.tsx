 
 
'use client';

import React, { type ChangeEvent, useCallback, useRef, useState } from 'react';
import Image from 'next/image';

import 'quill/dist/quill.snow.css';

import { zodResolver } from '@hookform/resolvers/zod';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Avatar,
  Box,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Paper,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import LoadingButton from '@mui/lab/LoadingButton';

import { TextEditor } from '../TextEditor/text-editor';
import { BASE_URL } from '@/utils/constants';

interface PostInterface {
  id: number;
  title: string;
  short_description: string;
  seo_title: string;
  seo_description: string;
  cover_photo: string;
  content: string;
}

const PaperStyled = styled(Paper)({
  boxShadow: 'rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
});

const UploadBox = styled(Box)({
  WebkitBoxAlign: 'center',
  alignItems: 'center',
  border: '1px dashed var(--mui-palette-divider)',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  flexWrap: 'wrap',
  WebkitBoxPack: 'center',
  justifyContent: 'center',
  outline: 'none',
  padding: '48px',

  '&:hover': {
    backgroundColor: 'rgba(240, 236, 236, 0.4)',
  },
});

const UploadIcon = styled(Avatar)({
  position: 'relative',
  display: 'flex',
  WebkitBoxAlign: 'center',
  alignItems: 'center',
  WebkitBoxPack: 'center',
  justifyContent: 'center',
  flexShrink: '0',
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  lineHeight: '1',
  borderRadius: '50%',
  overflow: 'hidden',
  userSelect: 'none',
  fontSize: '0.875rem',
  fontWeight: '500',
  height: '40px',
  letterSpacing: '0px',
  width: '40px',
  backgroundColor: '#ffffff',
  boxShadow: '0px 3px 14px rgba(0, 0, 0, 0.08)',
  color: '#212636',
});

const schema = zod.object({
  title: zod.string({
    required_error: 'Không được để trống',
  }),
  short_description: zod.string({
    required_error: 'Không được để trống',
  }),
  seo_title: zod.string({
    required_error: 'Không được để trống',
  }),
  seo_description: zod.string({
    required_error: 'Không được để trống',
  }),
  // cover_photo: zod.string({
  //   required_error: 'Không được để trống',
  // }),
  // content: zod.string({
  //   required_error: 'Không được để trống',
  // })
});

type Values = zod.infer<typeof schema>;

export function CreateBlog(): React.JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputFile = useRef<HTMLInputElement | null>(null);

  const onBrowsImage = useCallback(() => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  }, []);

  const onChangeCoverPhoto = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setSelectedImageUrl(objectUrl);
      setSelectedImage(file);
    }
  }, []);

  const onChangeContent = useCallback((contentCb: string) => {
    setContent(contentCb);
  }, []);

  const onSubmit = useCallback(async (data: Values) => {
    setIsLoading(true);
    const formData = new FormData();
    if (selectedImage) {
      formData.append('thumbnail', selectedImage);
    }
    formData.append('content', content);
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
      const response = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        body: formData
      });
      await response.json() as PostInterface;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Create failed', e);
    }
    setIsLoading(false);
  }, [selectedImage, content]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <PaperStyled>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                Thông tin cơ bản
              </Grid>
              <Grid item xs={9}>
                <Stack>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormControl>
                        <InputLabel htmlFor="title">Tiêu đề</InputLabel>
                        <OutlinedInput error={Boolean(errors.title)} id="title" label="Tiêu đề" {...field} />
                        {errors.title ? <FormHelperText error={Boolean(errors.title)}>{errors.title.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                  <Controller
                    control={control}
                    name="short_description"
                    render={({ field }) => (
                      <FormControl sx={{ marginTop: '24px' }}>
                        <InputLabel htmlFor="short_description">Thông tin mô tả ngắn gọn</InputLabel>
                        <OutlinedInput error={Boolean(errors.short_description)} id="short_description" label="Thông tin mô tả ngắn gọn" {...field} />
                        {errors.short_description ? (
                          <FormHelperText error={Boolean(errors.short_description)}>{errors.short_description.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </PaperStyled>
        <PaperStyled sx={{ marginTop: '24px' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                Hình ảnh cover
              </Grid>
              <Grid item xs={9}>
                <Stack direction="column" gap={3}>
                  {selectedImageUrl ? (
                    <Image
                      alt="title"
                      src={selectedImageUrl}
                      height={230}
                      width={635}
                      style={{ width: '100%' }}
                    />
                  ) : null}
                  <Stack>
                    <UploadBox onClick={onBrowsImage}>
                      <input onChange={onChangeCoverPhoto} accept="image/*" ref={inputFile} tabIndex={-1} type="file" hidden />
                      <Stack direction="row">
                        <UploadIcon>
                          <CloudUploadIcon />
                        </UploadIcon>
                        <Stack marginLeft={3}>
                          <Typography component="h6">
                            <Typography
                              sx={{
                                textDecoration: 'underline',
                              }}
                              component="span"
                            >
                              Click vào để
                            </Typography>{' '}
                            tải hình ảnh lên
                          </Typography>
                          <Typography component="p" fontSize="0.875rem" color="#667085">
                            (SVG, JPG, PNG, or gif maximum 900x400)
                          </Typography>
                        </Stack>
                      </Stack>
                    </UploadBox>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </PaperStyled>
        <PaperStyled sx={{ marginTop: '24px' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                Nội dung
              </Grid>
              <Grid item xs={9}>
                <TextEditor onChange={onChangeContent} />
                {/* {errors.content ? <FormHelperText error={Boolean(errors.content)}>{errors.content.message}</FormHelperText> : null} */}
              </Grid>
            </Grid>
          </CardContent>
        </PaperStyled>
        <PaperStyled sx={{ marginTop: '24px' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                Meta
              </Grid>
              <Grid item xs={9}>
                <Stack>
                  <Controller
                    control={control}
                    name="seo_title"
                    render={({ field }) => (
                      <FormControl>
                        <InputLabel htmlFor="seo_title">SEO title</InputLabel>
                        <OutlinedInput error={Boolean(errors.seo_title)} id="seo_title" label="SEO title" {...field} />
                        {errors.seo_title ? <FormHelperText error={Boolean(errors.seo_title)}>{errors.seo_title.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                  <Controller
                    control={control}
                    name="seo_description"
                    render={({ field }) => (
                      <FormControl sx={{ marginTop: '24px' }}>
                        <InputLabel htmlFor="seo_description">SEO description</InputLabel>
                        <OutlinedInput error={Boolean(errors.seo_description)} id="seo_description" label="SEO description" {...field} />
                        {errors.seo_description ? (
                          <FormHelperText error={Boolean(errors.seo_description)}>{errors.seo_description.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </PaperStyled>
        <PaperStyled sx={{ marginTop: '24px' }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton loading={isLoading} variant="contained" type="submit">
              Tạo bài viết
            </LoadingButton>
          </CardContent>
        </PaperStyled>
      </Stack>
    </form>
  );
}
