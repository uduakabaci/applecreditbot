export type DeviceType = 'iPhone' | 'iPad' | 'Mac';
export type OrderStatus = 'new' | 'in_review' | 'approved' | 'rejected';

export interface CreateOrderRequest {
  telegramChatId: number;
  telegramUserId: number;
  telegramUsername?: string;
  firstName?: string;
  lastName?: string;
  device: DeviceType;
  country: string;
  icloudEmail: string;
  fullName: string;
  consentGroupInvite: boolean;
  meta?: Record<string, unknown>;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  meta?: Record<string, unknown>;
}