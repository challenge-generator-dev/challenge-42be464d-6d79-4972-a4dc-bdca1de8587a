import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderStatus, OrderStatusEvent } from '../../shared/models/order-status.model';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService {
  private readonly API_URL = 'http://localhost:3000/orders/status';
  private orderStatuses = signal<OrderStatus[]>([]);

  constructor(private http: HttpClient) { }

  getOrderStatusStream(): Observable<MessageEvent> {
    return new Observable<MessageEvent>(observer => {
      const eventSource = new EventSource(`${this.API_URL}/stream`);

      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const eventData: OrderStatusEvent = JSON.parse(event.data);
          if (eventData.type === 'order-status') {
            this.orderStatuses.update(statuses => [...statuses, eventData.data]);
            observer.next(event);
          }
        } catch (error) {
          observer.error(new Error('Error parsing SSE event'));
        }
      };

      eventSource.onerror = (error: any) => {
        observer.error(new Error('SSE connection error'));
      };

      return () => {
        eventSource.close();
      };
    });
  }

  publishOrderStatus(orderStatus: OrderStatus): Observable<void> {
    return this.http.post<void>(this.API_URL, orderStatus);
  }

  getCurrentStatuses() {
    return this.orderStatuses.asReadonly();
  }
}