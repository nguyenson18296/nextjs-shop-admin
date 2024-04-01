import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface NotificationInterface {
    id: number;
    type: 'updated' | 'created';
    message: string;
    created_at: string;
    is_read: boolean;
}

interface NotificationStateInterface {
    notifications: NotificationInterface[];
}

const initialState: NotificationStateInterface = {
    notifications: [],
}

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        getNotifications(state, action: PayloadAction<NotificationInterface[]>) {
            state.notifications = action.payload;
        },
        updateNewNotification(state, action: PayloadAction<NotificationInterface>) {
            state.notifications.push(action.payload);
        }
    }
})

export const { getNotifications, updateNewNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;
