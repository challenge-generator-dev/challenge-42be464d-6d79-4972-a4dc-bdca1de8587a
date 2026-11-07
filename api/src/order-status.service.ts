import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject, Observable, interval, takeUntil, map } from 'rxjs';
import { OrderStatusDto, OrderStatusEvent } from '../domain/order-status.event';

@Injectable()
export class OrderStatusService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderStatusService.name);
  private readonly eventSubject = new Subject<OrderStatusEvent>();
  private readonly destroy$ = new Subject<void>();
  private isConsuming = false;
  private readonly kafkaBrokers: string[];
  private readonly kafkaTopic: string;
  private readonly kafkaGroupId: string;

  constructor(private readonly configService: ConfigService) {
    this.kafkaBrokers = this.configService.get<string[]>('kafka.brokers') || ['localhost:9092'];
    this.kafkaTopic = this.configService.get<string>('kafka.topic') || 'order-status';
    this.kafkaGroupId = this.configService.get<string>('kafka.groupId') || 'order-status-group';
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando OrderStatusService');
    await this.startConsuming();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Deteniendo OrderStatusService');
    await this.stopConsuming();
    this.destroy$.next();
    this.destroy$.complete();
  }

  async publishOrderStatus(dto: OrderStatusDto): Promise<OrderStatusEvent> {
    dto.validateInvariants();
    const event = new OrderStatusEvent(dto);
    this.logger.log(`Evento publicado: ${event.toString()}`);
    this.eventSubject.next(event);
    return event;
  }

  getOrderStatusStream(): Observable<OrderStatusEvent> {
    return this.eventSubject.asObservable();
  }

  private async startConsuming(): Promise<void> {
    if (this.isConsuming) {
      this.logger.warn('El consumidor ya está activo');
      return;
    }

    this.isConsuming = true;
    this.logger.log(`Iniciando consumo del topic: ${this.kafkaTopic}`);

    interval(5000)
      .pipe(
        takeUntil(this.destroy$),
        map((i) => {
          const statuses = ['PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'CANCELADO'];
          const statusIndex = i % statuses.length;
          const orderId = `ORD-${1000 + (i % 100)}`;
          return new OrderStatusDto(orderId, statuses[statusIndex]);
        }),
      )
      .subscribe({
        next: (dto) => {
          const event = new OrderStatusEvent(dto);
          this.eventSubject.next(event);
          this.logger.debug(`Evento simulado recibido: ${event.toString()}`);
        },
        error: (error) => {
          this.logger.error('Error en el consumo simulado', error);
        },
      });
  }

  async stopConsuming(): Promise<void> {
    if (!this.isConsuming) {
      this.logger.warn('El consumidor no está activo');
      return;
    }

    this.isConsuming = false;
    this.logger.log('Consumo detenido');
  }

  getConsumerStatus(): { isConsuming: boolean; topic: string; brokers: string[] } {
    return {
      isConsuming: this.isConsuming,
      topic: this.kafkaTopic,
      brokers: this.kafkaBrokers,
    };
  }
}