import { type NotificationInterface } from "@/lib/store/notifications.slice";

export interface NotificationResponseInterface {
    data: NotificationInterface[];
    success: boolean;
    status: number;
};
