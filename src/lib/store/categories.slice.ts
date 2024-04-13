import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type CategoryInterface } from '@/utils/constants';

interface CategoryStateInterface {
    categories: CategoryInterface[];
}

interface UpdateOrderInterface {
    destination_index?: number;
    source_index: number
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
        },
        updateOrderCategory(state, action: PayloadAction<UpdateOrderInterface>) {
            const updatedCategoryIndex = state.categories.findIndex((item, index) => index === action.payload.source_index);
            if (action.payload.destination_index !== undefined) {
                state.categories[updatedCategoryIndex].orders = action.payload.destination_index + 1;
                state.categories[action.payload.destination_index].orders = action.payload.destination_index + 2;
                state.categories = state.categories.sort((a, b) => a.orders - b.orders);
                for (let i = 0; i < state.categories.length; i++) {
                    state.categories[i].orders = i + 1;
                }
                state.categories.sort((a, b) => a.orders - b.orders);
            }
        }
    }
})

export const { getCategories, updateOrderCategory, addCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;
