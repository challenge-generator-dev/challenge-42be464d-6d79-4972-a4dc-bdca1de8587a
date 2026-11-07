import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { OrderStatusEvent } from '../../domain/order-status.event';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private kafka: Kafka;
  private producer: Producer;
  private readonly topic: string;
  private isConnected = false;

  constructor(private readonly configService: ConfigService) {
    this.topic = this.configService.get<string>('KAFKA_TOPIC', 'order-status-events');
  }

  onModuleInit() {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID', 'order-status-api'),
      brokers: this.parseBrokers(),
      ssl: this.configService.get<boolean>('KAFKA_SSL', false),
      sasl: this.configService.get<boolean>('KAFKA_SASL_ENABLED', false)
        ? {
            mechanism: this.configService.get<string>('KAFKA_SASL_MECHANISM', 'plain'),
            username: this.configService.get<string>('KAFKA_SASL_USERNAME', ''),
            password: this.configService.get<string>('KAFKA_SASL_PASSWORD', ''),
          }
        : undefined,
    });
    this.producer = this.kafka.producer();
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      this.logger.warn('Producer already connected');
      return;
    }
    try {
      await this.producer.connect();
      this.isConnected = true;
      this.logger.log('Kafka producer connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect Kafka producer', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    try {
      await this.producer.disconnect();
      this.isConnected = false;
      this.logger.log('Kafka producer disconnected');
    } catch (error) {
      this.logger.error('Failed to disconnect Kafka producer', error);
    }
  }

  async sendEvent(event: OrderStatusEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topic,
      messages: [
        {
          key: event.data.orderId,
          value: event.toString(),
          timestamp: Date.now().toString(),
          headers: {
            eventType: event.eventType,
            version: event.version,
          },
        },
      ],
    };
    try {
      await this.producer.send(record);
      this.logger.debug(`Event sent to topic ${this.topic}: ${event.data.orderId}`);
    } catch (error) {
      this.logger.error('Failed to send event to Kafka', error);
      throw error;
    }
  }

  async sendEvents(events: OrderStatusEvent[]): Promise<void> {
    const records = events.map((event) => ({
      topic: this.topic,
      messages: [
        {
          key: event.data.orderId,
          value: event.toString(),
          timestamp: Date.now().toString(),
          headers: {
            eventType: event.eventType,
            version: event.version,
          },
        },
      ],
    }));
    try {
      await this.producer.sendBatch({ messages: records.flatMap((r) => r.messages) });
      this.logger.debug(`Batch of ${events.length} events sent to topic ${this.topic}`);
    } catch (error) {
      this.logger.error('Failed to send batch events to Kafka', error);
      throw error;
    }
  }

  private parseBrokers(): string[] {
    const brokersString = this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092');
    return brokersString.split(',').map((b) => b.trim());
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }
}