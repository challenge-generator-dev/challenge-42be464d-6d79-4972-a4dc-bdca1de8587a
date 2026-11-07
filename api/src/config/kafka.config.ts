import { ConfigService } from '@nestjs/config';
import { KafkaConfig, KafkaConfigArgs } from 'kafkajs';

export interface KafkaEnvironmentConfig {
  clientId: string;
  brokers: string[];
  ssl: boolean;
  sasl: {
    mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
    username: string;
    password: string;
  } | null;
  retry: {
    initialRetryTime: number;
    retries: number;
  };
  connectionTimeout: number;
  authenticationTimeout: number;
}

export const KAFKA_TOPIC_ORDER_STATUS = 'order-status-events';
export const KAFKA_TOPIC_ORDER_CREATED = 'order-created-events';
export const KAFKA_CONSUMER_GROUP = 'order-status-consumer-group';

export function getKafkaConfig(configService: ConfigService): KafkaConfig {
  const brokersString = configService.get<string>('KAFKA_BROKERS', 'localhost:9092');
  const brokers = brokersString.split(',').map(b => b.trim());

  const hasSasl = configService.get<boolean>('KAFKA_SASL_ENABLED', false);
  
  const kafkaConfig: KafkaConfigArgs = {
    clientId: configService.get<string>('KAFKA_CLIENT_ID', 'order-status-api'),
    brokers,
    ssl: configService.get<boolean>('KAFKA_SSL', false),
    retry: {
      initialRetryTime: configService.get<number>('KAFKA_RETRY_INITIAL_TIME', 300),
      retries: configService.get<number>('KAFKA_RETRY_RETRIES', 8),
    },
    connectionTimeout: configService.get<number>('KAFKA_CONNECTION_TIMEOUT', 3000),
    authenticationTimeout: configService.get<number>('KAFKA_AUTHENTICATION_TIMEOUT', 3000),
  };

  if (hasSasl) {
    kafkaConfig.sasl = {
      mechanism: configService.get<'plain' | 'scram-sha-256' | 'scram-sha-512'>(
        'KAFKA_SASL_MECHANISM', 
        'plain'
      ),
      username: configService.get<string>('KAFKA_SASL_USERNAME', ''),
      password: configService.get<string>('KAFKA_SASL_PASSWORD', ''),
    };
  }

  return kafkaConfig as KafkaConfig;
}

export function getKafkaAdminConfig(configService: ConfigService): KafkaConfig {
  const kafkaConfig = getKafkaConfig(configService);
  return {
    ...kafkaConfig,
    clientId: `${kafkaConfig.clientId}-admin`,
  };
}

export function getProducerConfig(configService: ConfigService): KafkaConfig {
  const kafkaConfig = getKafkaConfig(configService);
  return {
    ...kafkaConfig,
    clientId: `${kafkaConfig.clientId}-producer`,
  };
}

export function getConsumerConfig(configService: ConfigService): KafkaConfig {
  const kafkaConfig = getKafkaConfig(configService);
  return {
    ...kafkaConfig,
    clientId: `${kafkaConfig.clientId}-consumer`,
  };
}

export const KAFKA_CONFIG_TOKEN = 'KAFKA_CONFIG';

export const kafkaConfigProvider = {
  provide: KAFKA_CONFIG_TOKEN,
  useFactory: (configService: ConfigService): KafkaConfig => {
    return getKafkaConfig(configService);
  },
  inject: [ConfigService],
};

export interface TopicPartitionConfig {
  topic: string;
  numPartitions: number;
  replicationFactor: number;
}

export const DEFAULT_TOPIC_CONFIGS: TopicPartitionConfig[] = [
  {
    topic: KAFKA_TOPIC_ORDER_STATUS,
    numPartitions: 3,
    replicationFactor: 1,
  },
  {
    topic: KAFKA_TOPIC_ORDER_CREATED,
    numPartitions: 3,
    replicationFactor: 1,
  },
];

export interface KafkaAclConfig {
  resourceType: 'TOPIC' | 'GROUP' | 'DELEGATION_TOKEN' | 'TRANSACTIONAL_ID';
  resourceName: string;
  principal: string;
  operation: 'READ' | 'WRITE' | 'CREATE' | 'DELETE' | 'ALTER' | 'DESCRIBE' | 'ALL';
  permission: 'ALLOW' | 'DENY';
}

export function validateKafkaEnvironment(configService: ConfigService): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const brokers = configService.get<string>('KAFKA_BROKERS');
  if (!brokers) {
    errors.push('KAFKA_BROKERS environment variable is required');
  }

  const clientId = configService.get<string>('KAFKA_CLIENT_ID');
  if (!clientId) {
    errors.push('KAFKA_CLIENT_ID environment variable is required');
  }

  const hasSasl = configService.get<boolean>('KAFKA_SASL_ENABLED', false);
  if (hasSasl) {
    const username = configService.get<string>('KAFKA_SASL_USERNAME');
    const password = configService.get<string>('KAFKA_SASL_PASSWORD');
    
    if (!username || !password) {
      errors.push('KAFKA_SASL_USERNAME and KAFKA_SASL_PASSWORD are required when SASL is enabled');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}