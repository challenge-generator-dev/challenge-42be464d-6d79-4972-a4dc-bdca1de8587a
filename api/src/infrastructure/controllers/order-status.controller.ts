import { Controller, Get, Post, Body, Res, HttpCode, HttpStatus, Inject, Logger } from '@nestjs/common';
import { Response } from 'express';
import { OrderStatusDto } from '../../domain/order-status.event';
import { OrderStatusService } from '../../application/order-status.service';
import { KafkaProducerService } from '../kafka/kafka.producer';

@Controller('orders/status')
export class OrderStatusController {
  private readonly logger = new Logger(OrderStatusController.name);
  private readonly clients: Map<string, Response> = new Map();

  constructor(
    private readonly orderStatusService: OrderStatusService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  @Get('stream')
  async getOrderStatusStream(@Res() res: Response): Promise<void> {
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    this.clients.set(clientId, res);
    this.logger.log(`Cliente SSE conectado: ${clientId}`);

    const heartbeatInterval = setInterval(() => {
      if (res.writableEnded) {
        clearInterval(heartbeatInterval);
        this.clients.delete(clientId);
        return;
      }
      res.write(`: heartbeat\n\n`);
    }, 30000);

    res.on('close', () => {
      clearInterval(heartbeatInterval);
      this.clients.delete(clientId);
      this.logger.log(`Cliente SSE desconectado: ${clientId}`);
    });

    const statusEvents = this.orderStatusService.getStatusStream();
    statusEvents.subscribe({
      next: (event) => {
        if (!res.writableEnded) {
          const sseData = `data: ${JSON.stringify(event)}\n\n`;
          res.write(sseData);
        }
      },
      error: (error) => {
        this.logger.error(`Error en stream SSE: ${error.message}`, error.stack);
        if (!res.writableEnded) {
          res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
        }
      },
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async publishOrderStatus(@Body() orderStatusDto: OrderStatusDto): Promise<{ success: boolean; event: string }> {
    this.logger.log(`Publicando evento de estado para orden: ${orderStatusDto.orderId}`);
    
    try {
      const orderStatusEvent = await this.orderStatusService.createStatusEvent(orderStatusDto);
      
      await this.kafkaProducer.send({
        topic: process.env.KAFKA_TOPIC_ORDER_STATUS || 'order-status-events',
        messages: [
          {
            key: orderStatusDto.orderId,
            value: orderStatusEvent.toString(),
          },
        ],
      });

      this.broadcastToSubscribers(orderStatusEvent);

      return {
        success: true,
        event: orderStatusEvent.toString(),
      };
    } catch (error) {
      this.logger.error(`Error al publicar estado de orden: ${error.message}`, error.stack);
      throw error;
    }
  }

  private broadcastToSubscribers(event: any): void {
    const eventData = event.toString();
    this.clients.forEach((client, clientId) => {
      if (!client.writableEnded) {
        try {
          client.write(`data: ${JSON.stringify(event)}\n\n`);
        } catch (error) {
          this.logger.error(`Error al enviar evento a cliente ${clientId}: ${error.message}`);
          this.clients.delete(clientId);
        }
      }
    });
  }
}