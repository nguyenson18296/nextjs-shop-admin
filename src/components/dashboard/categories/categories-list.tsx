'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { BASE_URL, type CategoryInterface } from '@/utils/constants';
import { Card, CardContent, CardMedia } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DraggingStyle,
  type DroppableProps,
  type DropResult,
  type NotDraggingStyle,
} from 'react-beautiful-dnd';

import { getCategories as getCategoriesSaveState, updateOrderCategory } from '@/lib/store/categories.slice';
import useFetchData from '@/hooks/use-fetch';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';

const grid = 8;

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? 'lightblue' : 'unset',
  padding: grid,
  display: 'flex',
  flex: 1,
});

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
  index: number
): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: '10px',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'unset',
  maxWidth: index === 0 ? window.innerWidth : window.innerWidth / 2,
  flex: 1,
  // styles we need to apply on draggables
  ...draggableStyle,
  width: '200px',
  overflow: 'hidden',
});

function StrictModeDroppable({ children, ...props }: DroppableProps): React.JSX.Element {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => {
      setEnabled(true);
    });
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  return <Droppable {...props}>{children}</Droppable>;
}

export default function CategoriesList(): React.JSX.Element {
  const { data: categories } = useFetchData<CategoryInterface[]>(`/categories`, 'GET');
  const dispatch = useAppDispatch();
  const categoriesState = useAppSelector((state) => state.category.categories);

  const getCategories = useCallback(() => {
    if (categories && categories?.length > 0) dispatch(getCategoriesSaveState(categories));
  }, [dispatch, categories]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const onDragEnd = useCallback(async (result: DropResult): Promise<void> => {
    try {
      const { draggableId, destination } = result;
      const data = {
        order_number: destination?.index
      }
      dispatch(
        updateOrderCategory({
          destination_index: result.destination?.index,
          source_index: result.source.index,
        })
      );
      await fetch(`${BASE_URL}/categories/${draggableId}/order`, {
        method: "PUT",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, [dispatch]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Card sx={{ minWidth: '100%', marginTop: '32px', overflow: 'auto' }}>
        <CardContent sx={{ width: 'max-content' }}>
          <Box sx={{ width: '100%' }}>
            <StrictModeDroppable droppableId="droppableList" type="droppableListItem" direction="horizontal">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                  <Grid
                    container
                    sx={{ flexWrap: 'nowrap', overflow: 'auto' }}
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    {(categoriesState || ([] as CategoryInterface[]).sort((a, b) => a.orders - b.orders)).map(
                      (category: CategoryInterface, index: number) => (
                        <Draggable key={category.id} draggableId={category.id.toString()} index={index}>
                          {(providedDraggable, snapshotDraggable) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              style={getItemStyle(
                                snapshotDraggable.isDragging,
                                providedDraggable.draggableProps.style,
                                index
                              )}
                              {...providedDraggable.dragHandleProps}
                            >
                              <Grid item sx={{ minWidth: 200 }} xs={2} key={category.id}>
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
                            </div>
                          )}
                        </Draggable>
                      )
                    )}
                  </Grid>
                </div>
              )}
            </StrictModeDroppable>
          </Box>
        </CardContent>
      </Card>
    </DragDropContext>
  );
}
