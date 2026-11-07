import { Component, OnInit, OnDestroy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OrderStatusService } from '../../core/services/order-status.service';
import { OrderStatus } from '../../shared/models/order-status.model';

interface OrderStatusDisplay {
  orderId: string;
  status: string;
  timestamp: Date;
  displayColor: string;
}

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit, OnDestroy {
  private readonly orderStatusService = inject(OrderStatusService);
  private readonly snackBar = inject(MatSnackBar);
  private sseSubscription: Subscription | null = null;

  readonly isConnected = signal(false);
  readonly isLoading = signal(false);
  readonly connectionError = signal<string | null>(null);
  readonly orderStatuses = signal<OrderStatusDisplay[]>([]);
  readonly newOrderId = signal('');
  readonly newStatus = signal('PENDIENTE');

  readonly statusOptions = ['PENDIENTE', 'CONFIRMADO', 'EN_PROCESO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

  readonly statusCount = computed(() => this.orderStatuses().length);
  readonly pendingCount = computed(() => 
    this.orderStatuses().filter(o => o.status === 'PENDIENTE').length
  );
  readonly completedCount = computed(() => 
    this.orderStatuses().filter(o => ['ENVIADO', 'ENTREGADO'].includes(o.status)).length
  );

  constructor() {
    effect(() => {
      const count = this.statusCount();
      console.log(`Total de estados de pedidos: ${count}`);
    });
  }

  ngOnInit(): void {
    this.connectToOrderStatusStream();
    this.loadInitialStatuses();
  }

  ngOnDestroy(): void {
    this.disconnectFromStream();
  }

  private connectToOrderStatusStream(): void {
    this.isLoading.set(true);
    this.connectionError.set(null);

    try {
      this.sseSubscription = this.orderStatusService.getOrderStatusStream()
        .subscribe({
          next: (event: MessageEvent) => {
            this.handleStatusEvent(event);
          },
          error: (error) => {
            console.error('Error en stream SSE:', error);
            this.connectionError.set('Error al conectar con el servidor de eventos');
            this.isConnected.set(false);
            this.isLoading.set(false);
            this.showNotification('Error de conexión con el servidor', 'error');
          },
          complete: () => {
            console.log('Stream SSE completado');
            this.isConnected.set(false);
            this.isLoading.set(false);
          }
        });

      setTimeout(() => {
        if (this.isLoading()) {
          this.isConnected.set(true);
          this.isLoading.set(false);
          this.showNotification('Conectado al stream de pedidos', 'success');
        }
      }, 1000);
    } catch (error) {
      console.error('Excepción al conectar al stream:', error);
      this.connectionError.set('Error de conexión');
      this.isLoading.set(false);
    }
  }

  private handleStatusEvent(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data) as OrderStatus;
      console.log('Evento de estado recibido:', data);

      const displayStatus: OrderStatusDisplay = {
        orderId: data.orderId,
        status: data.status,
        timestamp: new Date(),
        displayColor: this.getStatusColor(data.status)
      };

      this.orderStatuses.update(statuses => {
        const existingIndex = statuses.findIndex(s => s.orderId === data.orderId);
        if (existingIndex >= 0) {
          const updated = [...statuses];
          updated[existingIndex] = displayStatus;
          return updated;
        }
        return [displayStatus, ...statuses];
      });

      this.showNotification(`Pedido ${data.orderId}: ${data.status}`, 'info');
    } catch (error) {
      console.error('Error al procesar evento:', error);
    }
  }

  private loadInitialStatuses(): void {
    const currentStatuses = this.orderStatusService.getCurrentStatuses();
    if (currentStatuses && currentStatuses.length > 0) {
      const displayStatuses: OrderStatusDisplay[] = currentStatuses.map(status => ({
        orderId: status.orderId,
        status: status.status,
        timestamp: new Date(),
        displayColor: this.getStatusColor(status.status)
      }));
      this.orderStatuses.set(displayStatuses);
    }
  }

  publishNewStatus(): void {
    const orderId = this.newOrderId().trim();
    const status = this.newStatus();

    if (!orderId) {
      this.showNotification('Por favor ingresa un ID de pedido', 'warning');
      return;
    }

    const orderStatus: OrderStatus = {
      orderId,
      status
    };

    this.isLoading.set(true);

    this.orderStatusService.publishOrderStatus(orderStatus)
      .subscribe({
        next: () => {
          this.showNotification(`Estado ${status} publicado para pedido ${orderId}`, 'success');
          this.newOrderId.set('');
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error al publicar estado:', error);
          this.showNotification('Error al publicar estado del pedido', 'error');
          this.isLoading.set(false);
        }
      });
  }

  disconnectFromStream(): void {
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
      this.sseSubscription = null;
    }
    this.isConnected.set(false);
    console.log('Desconectado del stream de pedidos');
  }

  reconnect(): void {
    this.disconnectFromStream();
    this.connectToOrderStatusStream();
  }

  clearStatuses(): void {
    this.orderStatuses.set([]);
    this.showNotification('Estados limpiados', 'info');
  }

  private getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'PENDIENTE': '#FFA726',
      'CONFIRMADO': '#42A5F5',
      'EN_PROCESO': '#AB47BC',
      'ENVIADO': '#66BB6A',
      'ENTREGADO': '#26A69A',
      'CANCELADO': '#EF5350'
    };
    return colorMap[status] || '#9E9E9E';
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    const panelClass = `notification-${type}`;
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  trackByOrderId(index: number, item: OrderStatusDisplay): string {
    return item.orderId;
  }
}