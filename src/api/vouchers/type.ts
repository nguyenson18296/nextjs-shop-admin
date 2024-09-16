export interface IVoucher {
  id: string;
  code: string;
  discount_value: number;
  valid_from: string;
  valid_to: string;
  usage_limit: number;
  is_active: boolean;
}
