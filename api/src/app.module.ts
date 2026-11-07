import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderStatusController } from './infrastructure/controllers/order-status.controller';
import { OrderStatusService } from './order-status.service';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { kafkaConfig } from './config/kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kafkaConfig],
    }),
    KafkaModule,
  ],
  controllers: [OrderStatusController],
  providers: [OrderStatusService],
})
export class AppModule {}