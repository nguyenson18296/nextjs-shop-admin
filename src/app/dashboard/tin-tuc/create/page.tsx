import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

import { config } from '@/config';
import { CreateBlog } from '@/components/Blog/create-blog';

export const metadata = { title: `Tin tức | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" gutterBottom>
        Trang tin tức
      </Typography>
      <CreateBlog />
    </Stack>
  )
}