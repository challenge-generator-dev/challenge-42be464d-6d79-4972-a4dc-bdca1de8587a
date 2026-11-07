import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class OrderStatusDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  constructor(orderId: string, status: string) {
    this.orderId = orderId || uuidv4();
    this.status = status;
    this.validateInvariants();
  }

  private validateInvariants(): void {
    if (!this.orderId || !this.status) {
      throw new Error('OrderId and status are required');
    }
    if (typeof this.orderId !== 'string' || typeof this.status !== 'string') {
      throw new Error('OrderId and status must be strings');
    }
  }

  toEventData(): Record<string, string> {
    return {
      orderId: this.orderId,
      status: this.status,
      timestamp: new Date().toISOString(),
    };
  }

  static fromEventData(data: Record<string, any>): OrderStatusDto {
    if (!data.orderId || !data.status) {
      throw new Error('Invalid event data: missing orderId or status');
    }
    return new OrderStatusDto(data.orderId, data.status);
  }
}

export class OrderStatusEvent {
  readonly eventType = 'OrderStatusUpdated';
  readonly version = '1.0';
  readonly timestamp: string;
  readonly data: OrderStatusDto;

  constructor(data: OrderStatusDto) {
    this.timestamp = new Date().toISOString();
    this.data = data;
    this.validate();
  }

  private validate(): void {
    if (!this.data) {
      throw new Error('Event data is required');
    }
    if (!(this.data instanceof OrderStatusDto)) {
      throw new Error('Event data must be an instance of OrderStatusDto');
    }
  }

  toString(): string {
    return JSON.stringify({
      eventType: this.eventType,
      version: this.version,
      timestamp: this.timestamp,
      data: this.data.toEventData(),
    });
  }

  static fromString(eventString: string): OrderStatusEvent {
    try {
      const eventObj = JSON.parse(eventString);
      if (!eventObj.eventType || eventObj.eventType !== 'OrderStatusUpdated') {
        throw new Error('Invalid event type');
      }
      const data = OrderStatusDto.fromEventData(eventObj.data);
      return new OrderStatusEvent(data);
    } catch (error) {
      throw new Error(`Failed to parse event: ${error.message}`);
    }
  }
}