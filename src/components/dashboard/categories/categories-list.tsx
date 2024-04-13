'use client';

import React, { useCallback, useEffect } from 'react';
import { type CategoryInterface } from '@/utils/constants';
import { Card, CardContent, CardMedia } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import useFetchData from '@/hooks/use-fetch';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { getCategories as getCategoriesSaveState } from '@/lib/store/categories.slice';

export default function CategoriesList(): React.JSX.Element {
  const { data: categories } = useFetchData<CategoryInterface[]>(`/categories`, 'GET');
  const dispatch = useAppDispatch();
  const categoriesState = useAppSelector(state => state.category.categories);

  const getCategories = useCallback(() => {
    if (categories && categories?.length > 0)
      dispatch(getCategoriesSaveState(categories));
  }, [dispatch, categories]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <Card sx={{ minWidth: '100%', marginTop: '32px' }}>
      <CardContent>
        <Box sx={{ width: '100%' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {(categoriesState || ([] as CategoryInterface[])).map((category: CategoryInterface) => (
              <Grid item xs={2} key={category.id}>
                <Card sx={{ minWidth: '100%' }}>
                  <CardContent
                    sx={{
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="55"
                      width={55}
                      image={category.thumbnail}
                      alt={category.title}
                      sx={{
                        width: '55px',
                      }}
                    />
                    {category.title}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
