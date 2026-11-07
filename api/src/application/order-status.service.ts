import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, Subject, takeUntil } from 'rxjs';
import { OrderStatusDto, OrderStatusEvent } from '../domain/order-status.event';
import { KafkaProducerService } from '../infrastructure/kafka/kafka.producer';
import { KafkaConsumerService } from '../infrastructure/kafka/kafka.consumer';

@Injectable()
export class OrderStatusService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderStatusService.name);
  private readonly eventSubject = new Subject<OrderStatusEvent>();
  private readonly destroy$ = new Subject<void>();
  private isConsuming = false;
  private readonly kafkaBrokers: string[];
  private readonly kafkaTopic: string;
  private readonly kafkaGroupId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaProducer: KafkaProducerService,
    private readonly kafkaConsumer: KafkaConsumerService,
  ) {
    this.kafkaBrokers = this.configService.get<string[]>('kafka.brokers') || ['localhost:9092'];
    this.kafkaTopic = this.configService.get<string>('kafka.topic') || 'order-status-events';
    this.kafkaGroupId = this.configService.get<string>('kafka.groupId') || 'order-status-group';
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando OrderStatusService');
    try {
      await this.startConsuming();
    } catch (error) {
      this.logger.error('Error al iniciar el consumo de eventos', error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Deteniendo OrderStatusService');
    this.destroy$.next();
    this.destroy$.complete();
    await this.stopConsuming();
  }

  async publishOrderStatus(dto: OrderStatusDto): Promise<OrderStatusEvent> {
    this.logger.log(`Publicando estado de orden: ${dto.orderId} - ${dto.status}`);
    const event = new OrderStatusEvent(dto);
    await this.kafkaProducer.sendEvent(event);
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

    try {
      const eventStream$ = this.kafkaConsumer.getEventStream();
      eventStream$
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (event) => {
            this.logger.log(`Evento recibido: ${event.eventType} - ${event.data.orderId}`);
            this.eventSubject.next(event);
          },
          error: (error) => {
            this.logger.error('Error en el stream de eventos', error);
          },
        });

      this.isConsuming = true;
      this.logger.log('Consumo de eventos iniciado');
    } catch (error) {
      this.logger.error('Error al iniciar el consumidor', error);
      throw error;
    }
  }

  async stopConsuming(): Promise<void> {
    if (!this.isConsuming) {
      return;
    }

    try {
      await this.kafkaConsumer.disconnect();
      this.isConsuming = false;
      this.logger.log('Consumo de eventos detenido');
    } catch (error) {
      this.logger.error('Error al detener el consumidor', error);
    }
  }

  getConsumerStatus(): { isConsuming: boolean; isProducerConnected: boolean; isConsumerConnected: boolean } {
    return {
      isConsuming: this.isConsuming,
      isProducerConnected: this.kafkaProducer.getIsConnected(),
      isConsumerConnected: this.kafkaConsumer.getIsConnected(),
    };
  }
}