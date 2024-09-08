/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-console */
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BASE_URL } from '@/utils/constants';
import { Divider, Grid, Stack, Typography } from '@mui/material';
import { DragDropContext, Draggable, Droppable, type DropResult } from 'react-beautiful-dnd';

import { useSnackbar } from '@/contexts/use-snackbar-context';
import useFetchData from '@/hooks/use-fetch';

import { ListBlogItem } from './list-blog-item';

export interface TabInterface {
  id: number;
  name: string;
}

export interface PostItemInterface {
  id: number;
  title: string;
  short_description: string;
  cover_photo: string;
  created_at: string;
  slug: string;
  priority: number;
  user: {
    username: string;
    avatar: string;
  };
}

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? 'lightblue' : '',
  padding: 8,
});

export function ListBlogs({ activeTab }: { activeTab: TabInterface }): React.JSX.Element {
  const [posts, setPosts] = useState<PostItemInterface[]>([]);
  const { data: postsFetched } = useFetchData<{ data: PostItemInterface[]; total: number }>('/posts', 'GET');
  const { data: myPosts } = useFetchData<{ data: PostItemInterface[] }>('/posts/my-posts', 'GET');
  const { showSnackbar } = useSnackbar();

  const updatePost = useCallback(
    async (postId: string, destinationDroppableId: string) => {
      const formData = {
        priority: destinationDroppableId === 'top-post' ? 1 : 0,
      };
      try {
        await fetch(`${BASE_URL}/posts/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const clonePosts = [...posts];
        const updatedPostIndex = clonePosts.findIndex((post) => post.id === parseInt(postId));
        if (updatedPostIndex !== -1) {
          clonePosts[updatedPostIndex].priority = destinationDroppableId === 'top-post' ? 1 : 0;
        }
        setPosts(clonePosts);
      } catch (e) {
        showSnackbar(e as string, 'error');
      }
    },
    [posts, showSnackbar]
  );

  useEffect(() => {
    if (activeTab.id === 1) {
      if (postsFetched) {
        setPosts(postsFetched.data);
      }
    } else if (myPosts?.data) {
      console.log('myPosts?.data', myPosts?.data);
      setPosts(myPosts.data);
    }
  }, [postsFetched, myPosts, activeTab]);

  const topPosts = useMemo(() => posts.filter((post) => post.priority === 1), [posts]);

  const normalPosts = useMemo(() => posts.filter((post) => post.priority !== 1), [posts]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { draggableId, destination } = result;
      if (destination?.droppableId) {
        updatePost(draggableId, destination?.droppableId);
      }
    },
    [updatePost]
  );

  return (
    <Stack>
      <DragDropContext onDragEnd={onDragEnd}>
        <Typography variant="h4" gutterBottom>
          Danh sách bài viết Hàng đầu
        </Typography>
        <Stack
          spacing={2}
          sx={{
            marginTop: 4,
          }}
        >
          <Grid container spacing={2}>
            <Droppable droppableId="top-post">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
                  <Stack
                    spacing={2}
                    sx={{
                      marginTop: 4,
                    }}
                  >
                    {topPosts.length > 0 ? (
                      <Grid container spacing={2}>
                        {topPosts.map((post, index) => (
                          <Draggable key={post.id} draggableId={post.id.toString()} index={index}>
                            {(providedItem, _snapshotItem) => (
                              <Grid
                                item
                                xs={12}
                                md={6}
                                key={post.id}
                                ref={providedItem.innerRef}
                                {...providedItem.draggableProps}
                                {...providedItem.dragHandleProps}
                              >
                                <ListBlogItem post={post} key={post.id} />
                              </Grid>
                            )}
                          </Draggable>
                        ))}
                      </Grid>
                    ) : (
                      <Stack justifyContent="center" useFlexGap>
                        <Typography variant="h6" sx={{ color: '#f44336' }}>
                          Hiện không có bài viết nào
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </div>
              )}
            </Droppable>
          </Grid>
        </Stack>
        <Divider />
        <Stack spacing={2} marginTop={2}>
          <Typography variant="h4" gutterBottom>
            Danh sách bài viết
          </Typography>
          <Typography component="p">Discover the latest news, tips and user research insights from Acme.</Typography>
          <Typography component="p">
            You will learn about web infrastructure, design systems and devops APIs best practices.
          </Typography>
        </Stack>
        <Droppable droppableId="normal-post">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
              <Stack
                spacing={2}
                sx={{
                  marginTop: 4,
                }}
              >
                {normalPosts.length > 0 ? (
                  <Grid container spacing={2}>
                    {normalPosts.map((post, index) => (
                      <Draggable key={post.id} draggableId={post.id.toString()} index={index}>
                        {(providedItem, _snapshotItem) => (
                          <Grid
                            item
                            xs={12}
                            md={6}
                            key={post.id}
                            ref={providedItem.innerRef}
                            {...providedItem.draggableProps}
                            {...providedItem.dragHandleProps}
                          >
                            <ListBlogItem post={post} key={post.id} />
                          </Grid>
                        )}
                      </Draggable>
                    ))}
                  </Grid>
                ) : (
                  <Stack justifyContent="center" useFlexGap>
                    <Typography variant="h6" sx={{ color: '#f44336' }}>
                      Hiện không có bài viết nào
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Stack>
  );
}
