import { Avatar, CardMedia, Paper, Stack, Typography } from '@mui/material';
import { notFound } from 'next/navigation'

import { BASE_URL } from "@/utils/constants"

export const dynamicParams = true
export const dynamic = 'auto'

export default async function Page({
  params: { id },
}: { params: { id: string }}): Promise<React.JSX.Element> {
  const response = await fetch(`${BASE_URL}/posts/${id}`)
  const post = await response.json();

  if (post.statusCode === 404) {
    return notFound();
  }

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
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
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
  )
}
