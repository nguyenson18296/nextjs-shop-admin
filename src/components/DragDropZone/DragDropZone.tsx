import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { Avatar, Box, Stack, Typography, FormHelperText } from '@mui/material';

import { isImageFile } from '@/utils/format';

const CustomBox = styled(Box)({
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
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

const CustomAvatar = styled(Avatar)({
  position: 'relative',
  display: 'flex',
  WebkitBoxAlign: 'center',
  alignItems: 'center',
  WebkitBoxPack: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  lineHeight: 1,
  borderRadius: '50%',
  overflow: 'hidden',
  userSelect: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  height: '40px',
  letterSpacing: '0px',
  width: '40px',
  backgroundColor: '#ffffff',
  boxShadow: '0px 3px 14px rgba(0, 0, 0, 0.08)',
  color: '#212636',
});

interface DragDropZoneInterface {
  image?: string;
  setSelectedImage: (value: React.SetStateAction<File | null>) => void;
}

export function DragDropZone({ image, setSelectedImage }: DragDropZoneInterface): React.JSX.Element {
  const [thumbnail, setThumbnail] = useState<string>('');
  const [error, setError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
      if (image) {
        setThumbnail(image)
      }
  }, [image]);

  const onBrowseFile = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const onUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event?.target?.files[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setThumbnail(objectUrl);
        setSelectedImage(file);
      }
    }
  }, [setSelectedImage]);

  // Handle files
  const handleFiles = useCallback((file: File) => {
    const isImage = isImageFile(file);
    if (isImage) {
      const objectUrl = URL.createObjectURL(file);
      setThumbnail(objectUrl);
      setSelectedImage(file)
    } else {
      setError(!isImage);
    }
  }, [setSelectedImage]);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    // Handle dropped files
    handleFiles(files[0]);
  }, [handleFiles]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  return (
    <>
      {thumbnail ? (
        <Image
          style={{
            width: '100%',
          }}
          alt="img"
          width={500}
          height={200}
          src={thumbnail}
          className="w-full h-200px"
        />
      ) : null}
      <Stack
        direction="column"
        gap={2}
        sx={{
          display: 'flex',
        }}
      >
        <CustomBox
          onClick={onBrowseFile}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={handleDrop}
          sx={{
            background: isDragOver ? 'rgba(0, 0, 0, 0.04)' : '#fff'
          }}
        >
          <input
            accept="image/*"
            tabIndex={-1}
            type="file"
            onChange={onUpload}
            style={{ display: 'none' }}
            ref={fileRef}
          />
          <Stack direction="row" gap={4} alignItems="center">
            <CustomAvatar />
            <Stack display="flex" gap={2} direction="column">
              <Typography component="h6">
                <Typography
                  component="span"
                  sx={{
                    textDecoration: 'underline',
                  }}
                >
                  Click to upload
                </Typography>
                or drag and drop
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.57,
                  fontSize: '0.875rem',
                  color: '#667085',
                }}
              >
                (SVG, JPG, PNG, or gif maximum 900x400)
              </Typography>
            </Stack>
          </Stack>
        </CustomBox>
        {error ? <FormHelperText error>
            Định dạng file không đúng
          </FormHelperText> : null}
      </Stack>
    </>
  );
}
