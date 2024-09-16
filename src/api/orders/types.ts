export type TPaymentStatus = 'COMPLETED' | 'PENDING' | 'CANCELED' | 'REJECTED';

export interface IBuyerInfo {
  id: number | string;
  username: string;
  email: string;
  avatar: string;
  role: string;
}

export interface IOrderItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    short_description: string;
    description: string;
    price: string;
    discount_price: string;
  };
}

export interface IOrder {
  id: string;
  order_number: string;
  payment_status: TPaymentStatus;
  total: number;
  created_at: string;
  total_price: number;
  full_name: string;
  address: string;
  order_items: IOrderItem[];
  buyer_info: IBuyerInfo;
  issued_date?: string;
}
