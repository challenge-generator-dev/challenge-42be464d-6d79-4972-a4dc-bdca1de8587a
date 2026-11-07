# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `GET /orders/status/stream`
  - `POST /orders/status`
- `client` expone http (api: http://localhost:3000):
  - `GET /orders/status/stream`

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/application/order-status.service.ts` — `KafkaConsumerService.getIsConnected`: Se invoca `getIsConnected` sobre `KafkaConsumerService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/kafka/kafka.producer.ts` — `OrderStatusEvent.map`: Se invoca `map` sobre `OrderStatusEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/controllers/order-status.controller.ts` — `OrderStatusService.getStatusStream`: Se invoca `getStatusStream` sobre `OrderStatusService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/controllers/order-status.controller.ts` — `OrderStatusService.createStatusEvent`: Se invoca `createStatusEvent` sobre `OrderStatusService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/controllers/order-status.controller.ts` — `KafkaProducerService.send`: Se invoca `send` sobre `KafkaProducerService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Advanced L2

### Brecha de conocimiento
Publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real (corrida e2e 20261106194239047), Publica y consume eventos de un topic Kafka y refleja los mensajes en la interfaz

### Misión / candidato
Mostrar en vivo el estado de las ordenes

### Reto
- Tema: Consumo de eventos en tiempo real con Kafka
- Seniority: advanced-l2
- Tipo: practical
- Título: Consumo de eventos en tiempo real con Kafka
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración inicial del entorno — objetivo: Configurar el entorno de desarrollo para interactuar con Kafka. — entregable (NO resolver): Entorno de desarrollo configurado y conectado a Kafka.
- Fase 2: Publicación de eventos en Kafka — objetivo: Publicar eventos en un topic Kafka desde la aplicación frontend. — entregable (NO resolver): Funcionalidad implementada para publicar eventos en Kafka.
- Fase 3: Consumo de eventos en Kafka — objetivo: Consumir eventos de un topic Kafka y mostrarlos en la interfaz de usuario en tiempo real. — entregable (NO resolver): Funcionalidad implementada para consumir eventos de Kafka y mostrarlos en la interfaz.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-status-api",
  "version": "1.0.0",
  "description": "API para publicar y consumir eventos de estado de órdenes en tiempo real usando Kafka",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "format": "prettier --write \"src/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"src/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/swagger": "^7.1.13",
    "class-validator": "^0.14.0",
    "kafkajs": "^2.2.4",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.11.19",
    "@types/supertest": "^2.0.16",
    "@types/uuid": "^9.0.8",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "jest": "^29.7.0",
    "prettier": "^3.2.5",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}


// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "exclude": [
    "node_modules",
    "test",
    "dist"
  ]
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Order Status API')
    .setDescription('API para publicar y consumir eventos de estado de órdenes en tiempo real')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

// === ARCHIVO: api/src/domain/order-status.event.ts ===
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

// === ARCHIVO: api/src/app.module.ts ===
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

// === ARCHIVO: api/src/application/order-status.service.ts ===
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

// === ARCHIVO: api/src/infrastructure/kafka/kafka.module.ts ===
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

// === ARCHIVO: api/src/infrastructure/kafka/kafka.producer.ts ===
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

// === ARCHIVO: api/src/infrastructure/kafka/kafka.consumer.ts ===
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

// === ARCHIVO: api/src/infrastructure/controllers/order-status.controller.ts ===
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

// === ARCHIVO: api/src/infrastructure/controllers/order-status.controller.spec.ts ===
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

// === ARCHIVO: api/src/config/kafka.config.ts ===
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

// === ARCHIVO: api/src/order-status.service.ts ===
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject, Observable, interval, takeUntil, map } from 'rxjs';
import { OrderStatusDto, OrderStatusEvent } from '../domain/order-status.event';

@Injectable()
export class OrderStatusService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderStatusService.name);
  private readonly eventSubject = new Subject<OrderStatusEvent>();
  private readonly destroy$ = new Subject<void>();
  private isConsuming = false;
  private readonly kafkaBrokers: string[];
  private readonly kafkaTopic: string;
  private readonly kafkaGroupId: string;

  constructor(private readonly configService: ConfigService) {
    this.kafkaBrokers = this.configService.get<string[]>('kafka.brokers') || ['localhost:9092'];
    this.kafkaTopic = this.configService.get<string>('kafka.topic') || 'order-status';
    this.kafkaGroupId = this.configService.get<string>('kafka.groupId') || 'order-status-group';
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando OrderStatusService');
    await this.startConsuming();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Deteniendo OrderStatusService');
    await this.stopConsuming();
    this.destroy$.next();
    this.destroy$.complete();
  }

  async publishOrderStatus(dto: OrderStatusDto): Promise<OrderStatusEvent> {
    dto.validateInvariants();
    const event = new OrderStatusEvent(dto);
    this.logger.log(`Evento publicado: ${event.toString()}`);
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

    this.isConsuming = true;
    this.logger.log(`Iniciando consumo del topic: ${this.kafkaTopic}`);

    interval(5000)
      .pipe(
        takeUntil(this.destroy$),
        map((i) => {
          const statuses = ['PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'CANCELADO'];
          const statusIndex = i % statuses.length;
          const orderId = `ORD-${1000 + (i % 100)}`;
          return new OrderStatusDto(orderId, statuses[statusIndex]);
        }),
      )
      .subscribe({
        next: (dto) => {
          const event = new OrderStatusEvent(dto);
          this.eventSubject.next(event);
          this.logger.debug(`Evento simulado recibido: ${event.toString()}`);
        },
        error: (error) => {
          this.logger.error('Error en el consumo simulado', error);
        },
      });
  }

  async stopConsuming(): Promise<void> {
    if (!this.isConsuming) {
      this.logger.warn('El consumidor no está activo');
      return;
    }

    this.isConsuming = false;
    this.logger.log('Consumo detenido');
  }

  getConsumerStatus(): { isConsuming: boolean; topic: string; brokers: string[] } {
    return {
      isConsuming: this.isConsuming,
      topic: this.kafkaTopic,
      brokers: this.kafkaBrokers,
    };
  }
}

// === ARCHIVO: client/package.json ===
{
  "name": "order-status-client",
  "version": "0.0.1",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "20.0.0",
    "@angular/cdk": "18.0.0",
    "@angular/common": "20.0.0",
    "@angular/compiler": "20.0.0",
    "@angular/core": "20.0.0",
    "@angular/forms": "20.0.0",
    "@angular/material": "18.0.0",
    "@angular/platform-browser": "20.0.0",
    "@angular/platform-browser-dynamic": "20.0.0",
    "@angular/router": "20.0.0",
    "rxjs": "~7.8.1",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.2"
  },
  "devDependencies": {
    "@angular-builders/jest": "18.0.0",
    "@angular-devkit/build-angular": "20.0.0",
    "@angular/cli": "20.0.0",
    "@angular/compiler-cli": "20.0.0",
    "@types/jest": "29.5.12",
    "jest": "29.7.0",
    "jest-preset-angular": "14.0.3",
    "typescript": "~5.4.2"
  },
  "jest": {
    "preset": "jest-preset-angular",
    "setupFilesAfterEnv": ["<rootDir>/setup-jest.ts"],
    "testPathIgnorePatterns": [
      "<rootDir>/node_modules/",
      "<rootDir>/dist/",
      "<rootDir>/src/test.ts"
    ]
  }
}

// === ARCHIVO: client/angular.json ===
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "order-status-client": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:application": {
          "strict": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/order-status-client",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "node_modules/@angular/material/prebuilt-themes/indigo-pink.css"
            ],
            "scripts": []
          },
          "configurations": {
            "development": {
              "optimization": false,
              "outputHashing": "all",
              "sourceMap": true,
              "namedChunks": false,
              "extractLicenses": false,
              "vendorChunk": true,
              "buildOptimizer": false
            },
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ]
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "browserTarget": "order-status-client:build"
          },
          "configurations": {
            "development": {
              "browserTarget": "order-status-client:build:development"
            },
            "production": {
              "browserTarget": "order-status-client:build:production"
            }
          }
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "order-status-client:build"
          }
        },
        "test": {
          "builder": "@angular-builders/jest:run",
          "options": {
            "configPath": "./jest.config.js",
            "watch": false
          }
        }
      }
    }
  },
  "cli": {
    "analytics": false
  }
}

// === ARCHIVO: client/tsconfig.json ===
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": ["ES2022", "dom", "dom.iterable"],
    "skipLibCheck": true
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  },
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}

// === ARCHIVO: client/src/app/shared/models/order-status.model.ts ===
import { Injectable } from '@angular/core';

export interface OrderStatus {
  orderId: string;
  status: string;
  timestamp?: Date;
}

export interface OrderStatusEvent {
  type: 'order-status';
  data: OrderStatus;
}

// === ARCHIVO: client/src/app/core/services/order-status.service.ts ===
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderStatus, OrderStatusEvent } from '../../shared/models/order-status.model';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService {
  private readonly API_URL = 'http://localhost:3000/orders/status';
  private orderStatuses = signal<OrderStatus[]>([]);

  constructor(private http: HttpClient) { }

  getOrderStatusStream(): Observable<MessageEvent> {
    return new Observable<MessageEvent>(observer => {
      const eventSource = new EventSource(`${this.API_URL}/stream`);

      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const eventData: OrderStatusEvent = JSON.parse(event.data);
          if (eventData.type === 'order-status') {
            this.orderStatuses.update(statuses => [...statuses, eventData.data]);
            observer.next(event);
          }
        } catch (error) {
          observer.error(new Error('Error parsing SSE event'));
        }
      };

      eventSource.onerror = (error: any) => {
        observer.error(new Error('SSE connection error'));
      };

      return () => {
        eventSource.close();
      };
    });
  }

  publishOrderStatus(orderStatus: OrderStatus): Observable<void> {
    return this.http.post<void>(this.API_URL, orderStatus);
  }

  getCurrentStatuses() {
    return this.orderStatuses.asReadonly();
  }
}

// === ARCHIVO: client/src/app/core/services/order-status.service.spec.ts ===
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

// === ARCHIVO: client/src/main.ts ===
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Error al iniciar la aplicación Angular:', err));

// === ARCHIVO: client/src/index.html ===
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Order Status Client</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Aplicación de seguimiento de estado de órdenes en tiempo real">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
  <noscript>
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h1>JavaScript requerido</h1>
      <p>Por favor, habilite JavaScript para utilizar esta aplicación.</p>
    </div>
  </noscript>
</body>
</html>

// === ARCHIVO: client/src/app/app.config.ts ===
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations()
  ]
};

// === ARCHIVO: client/src/app/app.component.ts ===
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button aria-label="Menú principal">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="app-title">Sistema de Estado de Pedidos</span>
      <span class="spacer"></span>
      <button mat-icon-button aria-label="Notificaciones">
        <mat-icon>notifications</mat-icon>
      </button>
      <button mat-icon-button aria-label="Configuración">
        <mat-icon>settings</mat-icon>
      </button>
    </mat-toolbar>
    <main class="app-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .app-title {
      margin-left: 16px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .app-content {
      margin-top: 64px;
      padding: 24px;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }
  `]
})
export class AppComponent {
  title = 'order-status-client';

  constructor() {
    console.log('Aplicación de estado de pedidos iniciada');
  }
}

// === ARCHIVO: client/src/app/features/order-status/order-status.component.ts ===
import { Component, OnInit, OnDestroy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OrderStatusService } from '../../core/services/order-status.service';
import { OrderStatus } from '../../shared/models/order-status.model';

interface OrderStatusDisplay {
  orderId: string;
  status: string;
  timestamp: Date;
  displayColor: string;
}

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit, OnDestroy {
  private readonly orderStatusService = inject(OrderStatusService);
  private readonly snackBar = inject(MatSnackBar);
  private sseSubscription: Subscription | null = null;

  readonly isConnected = signal(false);
  readonly isLoading = signal(false);
  readonly connectionError = signal<string | null>(null);
  readonly orderStatuses = signal<OrderStatusDisplay[]>([]);
  readonly newOrderId = signal('');
  readonly newStatus = signal('PENDIENTE');

  readonly statusOptions = ['PENDIENTE', 'CONFIRMADO', 'EN_PROCESO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

  readonly statusCount = computed(() => this.orderStatuses().length);
  readonly pendingCount = computed(() => 
    this.orderStatuses().filter(o => o.status === 'PENDIENTE').length
  );
  readonly completedCount = computed(() => 
    this.orderStatuses().filter(o => ['ENVIADO', 'ENTREGADO'].includes(o.status)).length
  );

  constructor() {
    effect(() => {
      const count = this.statusCount();
      console.log(`Total de estados de pedidos: ${count}`);
    });
  }

  ngOnInit(): void {
    this.connectToOrderStatusStream();
    this.loadInitialStatuses();
  }

  ngOnDestroy(): void {
    this.disconnectFromStream();
  }

  private connectToOrderStatusStream(): void {
    this.isLoading.set(true);
    this.connectionError.set(null);

    try {
      this.sseSubscription = this.orderStatusService.getOrderStatusStream()
        .subscribe({
          next: (event: MessageEvent) => {
            this.handleStatusEvent(event);
          },
          error: (error) => {
            console.error('Error en stream SSE:', error);
            this.connectionError.set('Error al conectar con el servidor de eventos');
            this.isConnected.set(false);
            this.isLoading.set(false);
            this.showNotification('Error de conexión con el servidor', 'error');
          },
          complete: () => {
            console.log('Stream SSE completado');
            this.isConnected.set(false);
            this.isLoading.set(false);
          }
        });

      setTimeout(() => {
        if (this.isLoading()) {
          this.isConnected.set(true);
          this.isLoading.set(false);
          this.showNotification('Conectado al stream de pedidos', 'success');
        }
      }, 1000);
    } catch (error) {
      console.error('Excepción al conectar al stream:', error);
      this.connectionError.set('Error de conexión');
      this.isLoading.set(false);
    }
  }

  private handleStatusEvent(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data) as OrderStatus;
      console.log('Evento de estado recibido:', data);

      const displayStatus: OrderStatusDisplay = {
        orderId: data.orderId,
        status: data.status,
        timestamp: new Date(),
        displayColor: this.getStatusColor(data.status)
      };

      this.orderStatuses.update(statuses => {
        const existingIndex = statuses.findIndex(s => s.orderId === data.orderId);
        if (existingIndex >= 0) {
          const updated = [...statuses];
          updated[existingIndex] = displayStatus;
          return updated;
        }
        return [displayStatus, ...statuses];
      });

      this.showNotification(`Pedido ${data.orderId}: ${data.status}`, 'info');
    } catch (error) {
      console.error('Error al procesar evento:', error);
    }
  }

  private loadInitialStatuses(): void {
    const currentStatuses = this.orderStatusService.getCurrentStatuses();
    if (currentStatuses && currentStatuses.length > 0) {
      const displayStatuses: OrderStatusDisplay[] = currentStatuses.map(status => ({
        orderId: status.orderId,
        status: status.status,
        timestamp: new Date(),
        displayColor: this.getStatusColor(status.status)
      }));
      this.orderStatuses.set(displayStatuses);
    }
  }

  publishNewStatus(): void {
    const orderId = this.newOrderId().trim();
    const status = this.newStatus();

    if (!orderId) {
      this.showNotification('Por favor ingresa un ID de pedido', 'warning');
      return;
    }

    const orderStatus: OrderStatus = {
      orderId,
      status
    };

    this.isLoading.set(true);

    this.orderStatusService.publishOrderStatus(orderStatus)
      .subscribe({
        next: () => {
          this.showNotification(`Estado ${status} publicado para pedido ${orderId}`, 'success');
          this.newOrderId.set('');
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error al publicar estado:', error);
          this.showNotification('Error al publicar estado del pedido', 'error');
          this.isLoading.set(false);
        }
      });
  }

  disconnectFromStream(): void {
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
      this.sseSubscription = null;
    }
    this.isConnected.set(false);
    console.log('Desconectado del stream de pedidos');
  }

  reconnect(): void {
    this.disconnectFromStream();
    this.connectToOrderStatusStream();
  }

  clearStatuses(): void {
    this.orderStatuses.set([]);
    this.showNotification('Estados limpiados', 'info');
  }

  private getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'PENDIENTE': '#FFA726',
      'CONFIRMADO': '#42A5F5',
      'EN_PROCESO': '#AB47BC',
      'ENVIADO': '#66BB6A',
      'ENTREGADO': '#26A69A',
      'CANCELADO': '#EF5350'
    };
    return colorMap[status] || '#9E9E9E';
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    const panelClass = `notification-${type}`;
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  trackByOrderId(index: number, item: OrderStatusDisplay): string {
    return item.orderId;
  }
}

// === ARCHIVO: client/src/app/features/order-status/order-status.component.html ===
<div class="order-status">
  <header class="order-status__header">
    <h1 class="order-status__title">Estado de Órdenes</h1>
    <p class="order-status__subtitle">
      Monitorea y publica eventos de órdenes en tiempo real
    </p>
  </header>

  <section class="order-status__publish">
    <h2 class="order-status__section-title">Publicar Estado</h2>
    <form 
      class="order-status__form"
      [formGroup]="publishForm" 
      (ngSubmit)="onPublishStatus()">
      <div class="order-status__form-field">
        <label for="orderId" class="order-status__label">ID de Orden</label>
        <input
          id="orderId"
          type="text"
          class="order-status__input"
          formControlName="orderId"
          placeholder="Ej: ORD-001"
          aria-describedby="orderId-hint">
        @if (publishForm.get('orderId')?.touched && publishForm.get('orderId')?.invalid) {
          <span id="orderId-hint" class="order-status__error">
            El ID de orden es requerido
          </span>
        }
      </div>

      <div class="order-status__form-field">
        <label for="status" class="order-status__label">Estado</label>
        <select
          id="status"
          class="order-status__select"
          formControlName="status"
          aria-describedby="status-hint">
          <option value="" disabled>Selecciona un estado</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="PROCESANDO">PROCESANDO</option>
          <option value="COMPLETADO">COMPLETADO</noption>
          <option value="CANCELADO">CANCELADO</option>
        </select>
        @if (publishForm.get('status')?.touched && publishForm.get('status')?.invalid) {
          <span id="status-hint" class="order-status__error">
            Selecciona un estado válido
          </span>
        }
      </div>

      <button
        type="submit"
        class="order-status__submit-btn"
        [disabled]="publishForm.invalid || isPublishing()"
        aria-label="Publicar estado de orden">
        @if (isPublishing()) {
          <span class="order-status__spinner" aria-hidden="true"></span>
          Publicando...
        } @else {
          Publicar Estado
        }
      </button>
    </form>

    @if (publishError()) {
      <div class="order-status__notification order-status__notification--error" role="alert">
        <span class="order-status__notification-icon">⚠</span>
        {{ publishError() }}
        <button 
          class="order-status__notification-close" 
          (click)="clearPublishError()"
          aria-label="Cerrar notificación">
          ×
        </button>
      </div>
    }

    @if (publishSuccess()) {
      <div class="order-status__notification order-status__notification--success" role="status">
        <span class="order-status__notification-icon">✓</span>
        Estado publicado correctamente
        <button 
          class="order-status__notification-close" 
          (click)="clearPublishSuccess()"
          aria-label="Cerrar notificación">
          ×
        </button>
      </div>
    }
  </section>

  <section class="order-status__stream">
    <div class="order-status__stream-header">
      <h2 class="order-status__section-title">Eventos en Tiempo Real</h2>
      <div class="order-status__stream-controls">
        <span 
          class="order-status__connection-status"
          [class.order-status__connection-status--connected]="isConnected()"
          [class.order-status__connection-status--disconnected]="!isConnected()"
          role="status"
          aria-live="polite">
          @if (isConnected()) {
            <span class="order-status__status-dot" aria-hidden="true"></span>
            Conectado al stream
          } @else {
            <span class="order-status__status-dot order-status__status-dot--offline" aria-hidden="true"></span>
            Desconectado
          }
        </span>
        <button
          class="order-status__reconnect-btn"
          (click)="reconnect()"
          [disabled]="isConnected()"
          aria-label="Reconectar al stream de eventos">
          Reconectar
        </button>
      </div>
    </div>

    <app-order-status-list
      [statuses]="currentStatuses()"
      [isLoading]="isLoading()">
    </app-order-status-list>
  </section>
</div>

// === ARCHIVO: client/src/app/features/order-status/order-status.component.scss ===
// Variables locales del componente
$primary-color: #3f51b5;
$success-color: #4caf50;
$error-color: #f44336;
$warning-color: #ff9800;
$background-light: #fafafa;
$background-card: #ffffff;
$text-primary: #212121;
$text-secondary: #757575;
$border-color: #e0e0e0;
$spacing-unit: 8px;
$border-radius: 8px;
$transition-fast: 150ms ease-in-out;
$transition-normal: 300ms ease-in-out;

.order-status {
  max-width: 1200px;
  margin: 0 auto;
  padding: calc($spacing-unit * 3);
  font-family: 'Roboto', sans-serif;
  color: $text-primary;
  background-color: $background-light;
  min-height: 100vh;

  &__header {
    margin-bottom: calc($spacing-unit * 4);
    padding-bottom: calc($spacing-unit * 2);
    border-bottom: 1px solid $border-color;
  }

  &__title {
    font-size: 2rem;
    font-weight: 500;
    margin: 0 0 calc($spacing-unit);
    color: $text-primary;
  }

  &__subtitle {
    font-size: 1rem;
    color: $text-secondary;
    margin: 0;
  }

  &__section-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0 0 calc($spacing-unit * 2);
    color: $text-primary;
  }

  &__publish {
    background-color: $background-card;
    border-radius: $border-radius;
    padding: calc($spacing-unit * 3);
    margin-bottom: calc($spacing-unit * 3);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__form {
    display: grid;
    gap: calc($spacing-unit * 2);
    max-width: 500px;
  }

  &__form-field {
    display: flex;
    flex-direction: column;
    gap: calc($spacing-unit / 2);
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: $text-secondary;
  }

  &__input,
  &__select {
    padding: calc($spacing-unit * 1.5);
    border: 1px solid $border-color;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color $transition-fast, box-shadow $transition-fast;
    background-color: $background-card;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba($primary-color, 0.15);
    }

    &.ng-invalid.ng-touched {
      border-color: $error-color;
    }
  }

  &__error {
    font-size: 0.75rem;
    color: $error-color;
    margin-top: calc($spacing-unit / 2);
  }

  &__submit-btn {
    padding: calc($spacing-unit * 1.5) calc($spacing-unit * 3);
    background-color: $primary-color;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color $transition-fast, transform $transition-fast;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: calc($spacing-unit);

    &:hover:not(:disabled) {
      background-color: darken($primary-color, 8%);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      background-color: lighten($primary-color, 20%);
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  &__spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  &__notification {
    margin-top: calc($spacing-unit * 2);
    padding: calc($spacing-unit * 1.5) calc($spacing-unit * 2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: calc($spacing-unit);
    animation: slideIn $transition-normal;

    &--success {
      background-color: lighten($success-color, 40%);
      color: darken($success-color, 10%);
      border: 1px solid $success-color;
    }

    &--error {
      background-color: lighten($error-color, 35%);
      color: darken($error-color, 10%);
      border: 1px solid $error-color;
    }
  }

  &__notification-icon {
    font-size: 1.25rem;
    font-weight: bold;
  }

  &__notification-close {
    margin-left: auto;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: inherit;
    opacity: 0.7;
    transition: opacity $transition-fast;
    padding: 0;
    line-height: 1;

    &:hover {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__stream {
    background-color: $background-card;
    border-radius: $border-radius;
    padding: calc($spacing-unit * 3);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__stream-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: calc($spacing-unit * 2);
    flex-wrap: wrap;
    gap: calc($spacing-unit * 2);
  }

  &__stream-controls {
    display: flex;
    align-items: center;
    gap: calc($spacing-unit * 2);
  }

  &__connection-status {
    display: flex;
    align-items: center;
    gap: calc($spacing-unit);
    font-size: 0.875rem;
    padding: calc($spacing-unit / 2) calc($spacing-unit);
    border-radius: 16px;
    background-color: $background-light;

    &--connected {
      color: $success-color;
    }

    &--disconnected {
      color: $error-color;
    }
  }

  &__status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: $success-color;
    animation: pulse 2s ease-in-out infinite;

    &--offline {
      background-color: $error-color;
      animation: none;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1);
    }
  }

  &__reconnect-btn {
    padding: calc($spacing-unit / 2) calc($spacing-unit * 1.5);
    background-color: transparent;
    color: $primary-color;
    border: 1px solid $primary-color;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color $transition-fast, color $transition-fast;

    &:hover:not(:disabled) {
      background-color: $primary-color;
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

// Media queries para responsividad
@media (max-width: 768px) {
  .order-status {
    padding: calc($spacing-unit * 2);

    &__header {
      margin-bottom: calc($spacing-unit * 3);
    }

    &__title {
      font-size: 1.5rem;
    }

    &__stream-header {
      flex-direction: column;
      align-items: flex-start;
    }

    &__publish,
    &__stream {
      padding: calc($spacing-unit * 2);
    }
  }
}

// === ARCHIVO: client/src/app/shared/components/order-status-list/order-status-list.component.ts ===
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '../../models/order-status.model';

@Component({
  selector: 'app-order-status-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-status-list">
      <div class="order-status-list__empty" *ngIf="orderStatuses.length === 0">
        No hay estados de órdenes para mostrar
      </div>
      <div class="order-status-list__item" 
           *ngFor="let status of orderStatuses; trackBy: trackByOrderId"
           [class.order-status-list__item--new]="isNewItem(status)">
        <div class="order-status-list__order-id">
          <span class="order-status-list__label">Orden:</span>
          <span class="order-status-list__value">{{ status.orderId }}</span>
          <span class="order-status-list__badge" *ngIf="isNewItem(status)">NUEVO</span>
        </div>
        <div class="order-status-list__status">
          <span class="order-status-list__label">Estado:</span>
          <span class="order-status-list__value order-status-list__value--status">{{ status.status }}</span>
        </div>
        <div class="order-status-list__timestamp" *ngIf="status.timestamp">
          <span class="order-status-list__label">Actualizado:</span>
          <span class="order-status-list__value">{{ formatTimestamp(status.timestamp) }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./order-status-list.component.scss']
})
export class OrderStatusListComponent implements OnChanges {
  @Input() orderStatuses: OrderStatus[] = [];

  private readonly newItemIds = new Set<string>();

  ngOnChanges(): void {
    this.trackNewItems();
  }

  private trackNewItems(): void {
    const currentIds = new Set(this.orderStatuses.map(s => s.orderId));
    const previousIds = Array.from(this.newItemIds);
    
    previousIds.forEach(id => {
      if (!currentIds.has(id)) {
        this.newItemIds.delete(id);
      }
    });

    this.orderStatuses.forEach(status => {
      if (!this.newItemIds.has(status.orderId)) {
        this.newItemIds.add(status.orderId);
      }
    });
  }

  private clearNewItems(ids: Set<string>): void {
    ids.forEach(id => this.newItemIds.delete(id));
  }

  isNewItem(status: OrderStatus): boolean {
    return this.newItemIds.has(status.orderId);
  }

  formatTimestamp(timestamp: string | Date): string {
    if (!timestamp) return '-';
    
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    if (isNaN(date.getTime())) {
      return String(timestamp);
    }

    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  trackByOrderId(index: number, item: OrderStatus): string {
    return item.orderId;
  }
}

// === ARCHIVO: client/setup-jest.ts ===
// Setup de tests generado automaticamente (referenciado por la config del runner).
import 'jest-preset-angular/setup-jest';


// === ARCHIVO: client/src/app/app.routes.ts ===
import { Routes } from '@angular/router';
import { OrderStatusComponent } from './features/order-status/order-status.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrderStatusComponent,
    title: 'Estado de Órdenes'
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];

// === ARCHIVO: client/src/app/core/models/order-status.model.ts ===
export interface OrderStatus {
  orderId: string;
  status: string;
  timestamp?: string | Date;
}

export interface OrderStatusEvent {
  type: string;
  data: OrderStatus;
  timestamp: number;
}

export interface OrderStatusDto {
  orderId: string;
  status: string;
}

// === ARCHIVO: client/tsconfig.app.json ===
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.d.ts",
    "src/**/*.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts",
    "src/test.ts"
  ]
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  kafka:
    image: "apache/kafka:3.8.0"
    ports:
      - "127.0.0.1:9092:9092"
    environment:
      KAFKA_NODE_ID: "1"
      KAFKA_PROCESS_ROLES: "broker,controller"
      KAFKA_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:9093"
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://localhost:9092"
      KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
      KAFKA_CONTROLLER_QUORUM_VOTERS: "1@localhost:9093"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0"
    healthcheck:
      test: ["CMD-SHELL","/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092 > /dev/null 2>&1"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 30s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| Apache Kafka (KRaft, un nodo) | `apache/kafka:3.8.0` | 9092 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/kafka/create-topics.sh ===
#!/usr/bin/env bash
# Crea los topics en Kafka local (idempotente). Ejecutar con el compose levantado y healthy.
set -euo pipefail

docker compose exec -T kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic app-events --partitions 1 --replication-factor 1

```
