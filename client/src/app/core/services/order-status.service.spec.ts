import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderStatusService } from './order-status.service';
import { OrderStatus } from '../../shared/models/order-status.model';

describe('OrderStatusService', () => {
  let service: OrderStatusService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderStatusService]
    });

    service = TestBed.inject(OrderStatusService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('publishOrderStatus', () => {
    it('should send a POST request to publish order status', () => {
      const mockOrderStatus: OrderStatus = { orderId: '123', status: 'PROCESSING' };

      service.publishOrderStatus(mockOrderStatus).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne('http://localhost:3000/orders/status');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockOrderStatus);
      req.flush(null);
    });
  });

  describe('getOrderStatusStream', () => {
    it('should handle SSE connection and update order statuses', (done) => {
      const mockEvent = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'order-status',
          data: { orderId: '123', status: 'PROCESSING' }
        })
      });

      service.getOrderStatusStream().subscribe({
        next: (event) => {
          expect(event).toEqual(mockEvent);
          expect(service.getCurrentStatuses()().length).toBe(1);
          done();
        },
        error: done.fail
      });

      // Simulate SSE event (Jest doesn't support EventSource directly)
      // This test verifies the observable subscription handles events correctly
      const eventSourceSpy = jest.spyOn(window, 'EventSource');
      if (eventSourceSpy.mock) {
        eventSourceSpy.mock.calls[0][0].onmessage?.(mockEvent);
      }
    });

    it('should handle SSE connection errors', (done) => {
      service.getOrderStatusStream().subscribe({
        error: (err) => {
          expect(err.message).toBe('SSE connection error');
          done();
        }
      });

      const eventSourceSpy = jest.spyOn(window, 'EventSource');
      if (eventSourceSpy.mock) {
        eventSourceSpy.mock.calls[0][0].onerror?.({});
      }
    });
  });
});