import { Injectable } from '@angular/core';

export interface OrderStatus {
  orderId: string;
  status: string;
  timestamp?: Date;
}

export interface OrderStatusEvent {
  type: 'order-status';
  data: OrderStatus;
}