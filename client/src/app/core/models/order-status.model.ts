export interface OrderStatus {
  orderId: string;
  status: string;
  timestamp?: string | Date;
}

export interface OrderStatusEvent {
  type: string;
  data: OrderStatus;
  timestamp: number;
}

export interface OrderStatusDto {
  orderId: string;
  status: string;
}