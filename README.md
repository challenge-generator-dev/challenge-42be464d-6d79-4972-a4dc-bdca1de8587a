# Consumo de eventos en tiempo real con Kafka

Como desarrollador frontend, debes publicar y consumir eventos en un topic Kafka para mostrar el estado de las órdenes en tiempo real en la interfaz de usuario. El sistema debe reflejar los mensajes recibidos del topic Kafka en la interfaz de manera inmediata.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Consumo de eventos en tiempo real con Kafka |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración inicial del entorno

**Objetivo:** Configurar el entorno de desarrollo para interactuar con Kafka.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Configurar Kafka en el entorno de desarrollo.
- Verificar la conexión y asegurar que el topic Kafka está disponible para publicar y consumir eventos.

**Entregable:** Entorno de desarrollo configurado y conectado a Kafka.

<details>
<summary>Pistas de conocimiento</summary>

- Importancia de la configuración del entorno para la comunicación con Kafka.
- Verificación de la conexión y disponibilidad del topic.

</details>

### Fase 2: Publicación de eventos en Kafka

**Objetivo:** Publicar eventos en un topic Kafka desde la aplicación frontend.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Implementar la funcionalidad para publicar eventos en el topic Kafka.
- Asegurar que los eventos se publiquen correctamente y se puedan verificar en el topic.

**Entregable:** Funcionalidad implementada para publicar eventos en Kafka.

<details>
<summary>Pistas de conocimiento</summary>

- Mecanismos para publicar eventos en Kafka desde una aplicación frontend.
- Verificación de la publicación de eventos en el topic Kafka.

</details>

### Fase 3: Consumo de eventos en Kafka

**Objetivo:** Consumir eventos de un topic Kafka y mostrarlos en la interfaz de usuario en tiempo real.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Implementar la funcionalidad para consumir eventos del topic Kafka.
- Mostrar los eventos recibidos en la interfaz de usuario en tiempo real.

**Entregable:** Funcionalidad implementada para consumir eventos de Kafka y mostrarlos en la interfaz.

<details>
<summary>Pistas de conocimiento</summary>

- Técnicas para consumir eventos de Kafka en tiempo real.
- Actualización de la interfaz de usuario con los eventos recibidos.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es Kafka y por qué se utiliza en este contexto?
- **paraQueSirve**: ¿Para qué sirve publicar y consumir eventos en Kafka en una aplicación frontend?
- **comoSeUsa**: ¿Cómo se implementa la funcionalidad para publicar y consumir eventos en Kafka desde una aplicación frontend?
- **erroresComunes**: ¿Qué errores comunes pueden ocurrir al publicar y consumir eventos en Kafka y cómo se pueden evitar?
- **queDecisionesImplica**: ¿Qué decisiones implica la implementación de la funcionalidad para consumir eventos de Kafka y mostrarlos en la interfaz de usuario en tiempo real?

## Criterios de Evaluacion

- Configuración correcta del entorno de desarrollo para interactuar con Kafka.
- Implementación de la funcionalidad para publicar eventos en Kafka.
- Verificación de la publicación de eventos en el topic Kafka.
- Implementación de la funcionalidad para consumir eventos de Kafka.
- Mostrar los eventos recibidos en la interfaz de usuario en tiempo real.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

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

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
