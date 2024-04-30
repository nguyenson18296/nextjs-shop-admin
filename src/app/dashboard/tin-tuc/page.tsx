'use client'
import * as React from 'react';
// import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import { Button, ButtonGroup, Typography } from '@mui/material';

// import { config } from '@/config';
import { ListBlogs } from '@/components/Blog/ListBlog/list-blog';
import { type TabInterface } from '@/components/Blog/ListBlog/list-blog';
// export const metadata = { title: `Tin tức | Dashboard | ${config.site.name}` } satisfies Metadata;


const LIST_TABS: TabInterface[] = [
  {
    id: 1,
    name: 'Tất cả bài viết'
  },
  {
    id: 2,
    name: 'Bài viết của tôi'
  }
];

export default function Page(): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState(LIST_TABS[0]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          Trang tin tức
        </Typography>
        <ButtonGroup>
          {LIST_TABS.map(tab => (
            <Button
              variant={activeTab.id === tab.id ? 'contained': 'outlined'} 
              key={tab.id}
              onClick={() => { setActiveTab(tab); }}
            >
                {tab.name}
            </Button>
          ))}
        </ButtonGroup>
      </Stack>
      <ListBlogs activeTab={activeTab} />
    </Stack>
  )
}