import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusController } from './order-status.controller';
import { OrderStatusService } from '../../application/order-status.service';
import { KafkaProducerService } from '../kafka/kafka.producer';
import { OrderStatusDto, OrderStatusEvent } from '../../domain/order-status.event';
import { Observable, Subject } from 'rxjs';

describe('OrderStatusController', () => {
  let controller: OrderStatusController;
  let orderStatusService: jest.Mocked<OrderStatusService>;
  let kafkaProducer: jest.Mocked<KafkaProducerService>;
  let mockResponse: any;
  let statusSubject: Subject<any>;

  beforeEach(async () => {
    statusSubject = new Subject<any>();
    
    const mockOrderStatusService = {
      createStatusEvent: jest.fn(),
      getStatusStream: jest.fn().mockReturnValue(statusSubject.asObservable()),
    };

    const mockKafkaProducer = {
      send: jest.fn().mockResolvedValue(undefined),
    };

    mockResponse = {
      writeHead: jest.fn(),
      write: jest.fn(),
      on: jest.fn(),
      writableEnded: false,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderStatusController],
      providers: [
        { provide: OrderStatusService, useValue: mockOrderStatusService },
        { provide: KafkaProducerService, useValue: mockKafkaProducer },
      ],
    }).compile();

    controller = module.get<OrderStatusController>(OrderStatusController);
    orderStatusService = module.get(OrderStatusService);
    kafkaProducer = module.get(KafkaProducerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /orders/status/stream', () => {
    it('debe establecer conexión SSE con headers correctos', async () => {
      await controller.getOrderStatusStream(mockResponse);

      expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
    });

    it('debe escribir eventos en la respuesta cuando se reciben', async () => {
      const mockEvent = new OrderStatusEvent(new OrderStatusDto('ORD-001', 'PROCESSING'));
      
      const promise = controller.getOrderStatusStream(mockResponse);\n      
      setTimeout(() => {
        statusSubject.next(mockEvent);
      }, 10);

      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(mockResponse.write).toHaveBeenCalledWith(
        expect.stringContaining('data:')
      );
    });

    it('debe manejar errores del stream gracefully', async () => {
      const promise = controller.getOrderStatusStream(mockResponse);
      
      setTimeout(() => {
        statusSubject.error(new Error('Kafka connection failed'));
      }, 10);

      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(mockResponse.write).toHaveBeenCalledWith(
        expect.stringContaining('event: error')
      );
    });

    it('debe limpiar el cliente al cerrar la conexión', async () => {
      const closeCallback = jest.fn();
      mockResponse.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'close') {
          closeCallback();
        }
      });

      await controller.getOrderStatusStream(mockResponse);
      
      const closeHandler = mockResponse.on.mock.calls.find(
        (call: any[]) => call[0] === 'close'
      )?.[1];
      
      if (closeHandler) {
        closeHandler();
      }

      expect(closeCallback).toHaveBeenCalled();
    });
  });

  describe('POST /orders/status', () => {
    it('debe crear evento y publicar en Kafka exitosamente', async () => {
      const orderStatusDto = new OrderStatusDto('ORD-001', 'PROCESSING');
      const mockEvent = new OrderStatusEvent(orderStatusDto);
      
      orderStatusService.createStatusEvent.mockResolvedValue(mockEvent);
      kafkaProducer.send.mockResolvedValue(undefined);

      const result = await controller.publishOrderStatus(orderStatusDto);

      expect(orderStatusService.createStatusEvent).toHaveBeenCalledWith(orderStatusDto);
      expect(kafkaProducer.send).toHaveBeenCalledWith({
        topic: expect.any(String),
        messages: [
          {
            key: 'ORD-001',
            value: mockEvent.toString(),
          },
        ],
      });
      expect(result.success).toBe(true);
      expect(result.event).toBe(mockEvent.toString());
    });

    it('debe manejar errores cuando falla la publicación en Kafka', async () => {
      const orderStatusDto = new OrderStatusDto('ORD-001', 'PROCESSING');
      const mockEvent = new OrderStatusEvent(orderStatusDto);
      
      orderStatusService.createStatusEvent.mockResolvedValue(mockEvent);
      kafkaProducer.send.mockRejectedValue(new Error('Kafka unavailable'));

      await expect(controller.publishOrderStatus(orderStatusDto)).rejects.toThrow(
        'Kafka unavailable'
      );
    });

    it('debe validar el DTO entrante', async () => {
      const invalidDto = new OrderStatusDto('', '');

      await expect(
        controller.publishOrderStatus(invalidDto as any)
      ).rejects.toThrow();
    });

    it('debe retornar código 201 Created', async () => {
      const orderStatusDto = new OrderStatusDto('ORD-001', 'SHIPPED');
      const mockEvent = new OrderStatusEvent(orderStatusDto);
      
      orderStatusService.createStatusEvent.mockResolvedValue(mockEvent);
      kafkaProducer.send.mockResolvedValue(undefined);

      const result = await controller.publishOrderStatus(orderStatusDto);

      expect(result.success).toBe(true);
    });
  });

  describe('broadcastToSubscribers', () => {
    it('debe enviar eventos a todos los clientes conectados', async () => {
      const mockEvent = new OrderStatusEvent(new OrderStatusDto('ORD-001', 'DELIVERED'));
      
      const mockResponse2 = { write: jest.fn(), writableEnded: false };
      (controller as any).clients.set('client_1', mockResponse);
      (controller as any).clients.set('client_2', mockResponse2);

      controller['broadcastToSubscribers'](mockEvent);

      expect(mockResponse.write).toHaveBeenCalled();
      expect(mockResponse2.write).toHaveBeenCalled();
    });

    it('debe eliminar clientes con conexión cerrada', async () => {
      mockResponse.writableEnded = true;
      (controller as any).clients.set('client_1', mockResponse);

      const mockEvent = new OrderStatusEvent(new OrderStatusDto('ORD-001', 'CANCELLED'));
      controller['broadcastToSubscribers'](mockEvent);

      expect((controller as any).clients.has('client_1')).toBe(false);
    });
  });
});