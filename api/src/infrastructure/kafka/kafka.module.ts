import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaProducerService } from './kafka.producer';
import { KafkaConsumerService } from './kafka.consumer';
import { loadKafkaConfig, KafkaEnvironmentConfig } from '../../config/kafka.config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'KAFKA_CONFIG',
      inject: [ConfigService],
      useFactory: (configService: ConfigService): KafkaEnvironmentConfig => {
        return loadKafkaConfig(configService);
      },
    },
    KafkaProducerService,
    KafkaConsumerService,
  ],
  exports: [KafkaProducerService, KafkaConsumerService, 'KAFKA_CONFIG'],
})
export class KafkaModule {}