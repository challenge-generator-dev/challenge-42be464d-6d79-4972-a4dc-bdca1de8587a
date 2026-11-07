import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '../../models/order-status.model';

@Component({
  selector: 'app-order-status-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-status-list">
      <div class="order-status-list__empty" *ngIf="orderStatuses.length === 0">
        No hay estados de órdenes para mostrar
      </div>
      <div class="order-status-list__item" 
           *ngFor="let status of orderStatuses; trackBy: trackByOrderId"
           [class.order-status-list__item--new]="isNewItem(status)">
        <div class="order-status-list__order-id">
          <span class="order-status-list__label">Orden:</span>
          <span class="order-status-list__value">{{ status.orderId }}</span>
          <span class="order-status-list__badge" *ngIf="isNewItem(status)">NUEVO</span>
        </div>
        <div class="order-status-list__status">
          <span class="order-status-list__label">Estado:</span>
          <span class="order-status-list__value order-status-list__value--status">{{ status.status }}</span>
        </div>
        <div class="order-status-list__timestamp" *ngIf="status.timestamp">
          <span class="order-status-list__label">Actualizado:</span>
          <span class="order-status-list__value">{{ formatTimestamp(status.timestamp) }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./order-status-list.component.scss']
})
export class OrderStatusListComponent implements OnChanges {
  @Input() orderStatuses: OrderStatus[] = [];

  private readonly newItemIds = new Set<string>();

  ngOnChanges(): void {
    this.trackNewItems();
  }

  private trackNewItems(): void {
    const currentIds = new Set(this.orderStatuses.map(s => s.orderId));
    const previousIds = Array.from(this.newItemIds);
    
    previousIds.forEach(id => {
      if (!currentIds.has(id)) {
        this.newItemIds.delete(id);
      }
    });

    this.orderStatuses.forEach(status => {
      if (!this.newItemIds.has(status.orderId)) {
        this.newItemIds.add(status.orderId);
      }
    });
  }

  private clearNewItems(ids: Set<string>): void {
    ids.forEach(id => this.newItemIds.delete(id));
  }

  isNewItem(status: OrderStatus): boolean {
    return this.newItemIds.has(status.orderId);
  }

  formatTimestamp(timestamp: string | Date): string {
    if (!timestamp) return '-';
    
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    if (isNaN(date.getTime())) {
      return String(timestamp);
    }

    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  trackByOrderId(index: number, item: OrderStatus): string {
    return item.orderId;
  }
}