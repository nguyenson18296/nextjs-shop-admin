import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CategoryInterface {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
}

interface CategoryStateInterface {
    categories: CategoryInterface[];
}

const initialState: CategoryStateInterface = {
    categories: [],
}

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        getCategories(state, action: PayloadAction<CategoryInterface[]>) {
            state.categories = action.payload;
        },
        addCategory(state, action: PayloadAction<CategoryInterface>) {
            state.categories.push(action.payload);
        }
    }
})

export const { getCategories, addCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;
