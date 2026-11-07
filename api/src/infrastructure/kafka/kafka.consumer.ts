import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { Observable, Subject, filter } from 'rxjs';
import { OrderStatusEvent } from '../../domain/order-status.event';

export interface KafkaConsumerOptions {
  brokers: string[];
  groupId: string;
  topic: string;
  clientId?: string;
}

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private topic: string;
  private isConnected: boolean = false;
  private readonly eventSubject = new Subject<OrderStatusEvent>();

  constructor(
    private readonly configService: ConfigService,
    @Inject('KAFKA_CONFIG') private readonly kafkaConfig: { brokers: string[]; groupId: string; topic: string },
  ) {
    this.topic = this.kafkaConfig.topic;
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID', 'order-status-consumer'),
      brokers: this.kafkaConfig.brokers,
    });
    this.consumer = this.kafka.consumer({ groupId: this.kafkaConfig.groupId });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    await this.startConsuming();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
      this.isConnected = true;
      this.logger.log(`Conectado al topic Kafka: ${this.topic}`);
    } catch (error) {
      this.logger.error(`Error al conectar al consumidor Kafka: ${error}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    try {
      await this.consumer.disconnect();
      this.isConnected = false;
      this.logger.log('Consumidor Kafka desconectado');
    } catch (error) {
      this.logger.error(`Error al desconectar el consumidor Kafka: ${error}`);
      throw error;
    }
  }

  async startConsuming(): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        const messageValue = message.value?.toString();
        if (messageValue) {
          try {
            const event = OrderStatusEvent.fromString(messageValue);
            this.eventSubject.next(event);
            this.logger.debug(`Evento procesado: ${event.eventType} - ${event.data.orderId}`);
          } catch (error) {
            this.logger.warn(`Error al procesar mensaje: ${error}`);
          }
        }
      },
    });
  }

  getEventStream(): Observable<OrderStatusEvent> {
    return this.eventSubject.asObservable();
  }

  getFilteredStream(eventType?: string): Observable<OrderStatusEvent> {
    if (eventType) {
      return this.eventSubject.pipe(
        filter(event => event.eventType === eventType)
      );
    }
    return this.eventSubject.asObservable();
  }

  isConnected(): boolean {
    return this.isConnected;
  }

  getTopic(): string {
    return this.topic;
  }

  getConsumerStatus(): { connected: boolean; topic: string; groupId: string } {
    return {
      connected: this.isConnected,
      topic: this.topic,
      groupId: this.kafkaConfig.groupId,
    };
  }
}