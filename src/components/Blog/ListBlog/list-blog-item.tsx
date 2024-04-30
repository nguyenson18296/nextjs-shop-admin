import React from 'react';
import { Avatar, CardMedia, Paper, Stack, Typography } from '@mui/material';

import { type PostItemInterface } from './list-blog';

export function ListBlogItem({ post }: { post: PostItemInterface }): React.JSX.Element {
  return (
    <Paper elevation={2}>
      <CardMedia component="img" height={280} image={post.cover_photo} alt={post.title} />
      <Stack
        sx={{
          padding: 2,
        }}
        spacing={2}
      >
        <Typography variant="h5">{post.title}</Typography>
        <Typography
          component="p"
          sx={{
            color: '#667085',
          }}
        >
          {post.short_description}
        </Typography>
        <Stack
          useFlexGap
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
            }}
          >
            <Avatar src={post.user.avatar} alt={post.user.username} />
            <Typography component="span" marginLeft={1}>
              By <strong>{post.user.username}</strong>
            </Typography>
          </Stack>
          <Typography>{post.created_at}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
