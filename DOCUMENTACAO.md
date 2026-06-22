# Sisteminha Embrapa — Documentação Completa

> **Stack:** Next.js 15 (App Router) · TypeScript (strict) · Prisma ORM · PostgreSQL · Tailwind CSS v4 · Zustand · Zod  
> **Arquitetura:** Service Layer + Repository Pattern + Injeção de Dependência (DI) · Separação por módulos (SRP)  
> **Autenticação:** JWT httpOnly + bcryptjs · Autorização: USER / SUPER_ADMIN

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Estrutura de Diretórios](#2-estrutura-de-diretórios)
3. [Modelo de Dados (Prisma)](#3-modelo-de-dados-prisma)
4. [Camada Core](#4-camada-core)
5. [Módulos de Negócio](#5-módulos-de-negócio)
6. [API Routes](#6-api-routes)
7. [Páginas (Frontend)](#7-páginas-frontend)
8. [Componentes UI](#8-componentes-ui)
9. [Segurança](#9-segurança)
10. [Infraestrutura & DevOps](#10-infraestrutura--devops)
11. [Scripts & Qualidade](#11-scripts--qualidade)
12. [Guia de Extensibilidade](#12-guia-de-extensibilidade)

---

## 1. Visão Geral

**Sisteminha Embrapa** é uma plataforma web para monitoramento IoT, registros manuais, calculadora de escalonamento agrícola e CMS educativo, voltada a pequenos produtores rurais. O sistema segue uma arquitetura modular com princípios SOLID (Single Responsibility, Dependency Inversion) e utiliza um contêiner de injeção de dependência centralizado.

### Funcionalidades principais

| Funcionalidade | Descrição |
|---|---|
| **Autenticação** | Cadastro, login, logout, perfil. Confirmação de senha obrigatória. |
| **Dashboard** | Resumo de sensores (média, mínima, máxima), alertas ativos. |
| **Leituras IoT** | Histórico paginado, filtro por tipo de sensor, refresh manual. |
| **Registros Manuais** | CRUD completo com filtros, busca, ordenação, visualização cards/tabela. |
| **Alertas** | Alertas automáticos por thresholds, resolução, filtro por tipo. |
| **Calculadora** | Escalonamento de produção agrícola com 50+ culturas, por região. |
| **Agendador (Scheduler)** | Coleta automática de leituras a cada 3h, pause/resume manual. |
| **Aulas** | CMS de aulas com slugs, vídeo, categoria, conteúdo textual. |
| **Documentação** | CMS de páginas de documentação com slugs. |
| **Admin de Usuários** | Listagem e exclusão (soft delete) de usuários. |

---

## 2. Estrutura de Diretórios

```
/
├── app/                          # Next.js App Router (páginas + API)
│   ├── admin/
│   │   ├── docs/page.tsx         # Admin docs
│   │   ├── iot/page.tsx          # Admin ingestão IoT
│   │   ├── lessons/page.tsx      # Admin aulas
│   │   ├── scheduler/page.tsx    # Admin agendador
│   │   └── users/page.tsx        # Admin usuários
│   ├── alerts/page.tsx           # Página de alertas
│   ├── api/                      # 25 rotas de API
│   │   ├── alerts/
│   │   ├── auth/                 # login, register, logout, profile
│   │   ├── calculator/
│   │   ├── dashboard/            # stats, historical, summary
│   │   ├── docs/
│   │   ├── iot/                  # history, ingest, readings, refresh
│   │   ├── lessons/
│   │   ├── manual-records/
│   │   ├── scheduler/            # status, pause, resume
│   │   └── users/
│   ├── aulas/[slug]/page.tsx     # Página pública de aula
│   ├── calculator/page.tsx       # Calculadora agrícola
│   ├── dashboard/page.tsx        # Dashboard (server component)
│   ├── docs/[slug]/page.tsx      # Página pública de documentação
│   ├── globals.css               # Design tokens CSS
│   ├── layout.tsx                # Layout raiz (Header + Footer)
│   ├── login/page.tsx
│   ├── manual-records/page.tsx
│   ├── page.tsx                  # Home page
│   ├── profile/page.tsx
│   ├── readings/page.tsx
│   └── register/page.tsx
│
├── prisma/
│   ├── schema.prisma             # Modelo de dados
│   ├── seed.ts                   # Seed inicial (SUPER_ADMIN)
│   └── migrations/               # Migrações SQL
│
├── src/
│   ├── components/
│   │   ├── auth/AuthGuard.tsx    # Proteção de rota (client)
│   │   ├── dashboard/
│   │   │   ├── AlertBadge.tsx
│   │   │   ├── RefreshDashboardButton.tsx
│   │   │   └── SensorCard.tsx
│   │   ├── navigation/
│   │   │   ├── Header.tsx        # Navbar responsiva com autenticação
│   │   │   └── Footer.tsx
│   │   └── ui/                   # Design System
│   │       ├── AlertBanner.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Loading.tsx
│   │       ├── PageHeader.tsx
│   │       ├── Select.tsx
│   │       └── Textarea.tsx
│   │
│   ├── core/                     # Infraestrutura transversal
│   │   ├── database/prisma.ts    # Singleton Prisma Client
│   │   ├── di/container.ts       # Container de injeção de dependência
│   │   ├── errors/AppError.ts    # Classe de erro customizada
│   │   ├── http/
│   │   │   ├── auth.ts           # JWT sign/verify, cookies, sessão
│   │   │   ├── rateLimit.ts      # Rate limiter em memória
│   │   │   └── response.ts       # Tratamento de erros HTTP
│   │   └── scheduler/init.ts     # Inicialização do cron
│   │
│   ├── lib/api.ts                # fetch wrapper com auto-redirect 401
│   ├── store/authStore.ts        # Zustand store de autenticação
│   │
│   └── modules/                  # Módulos de negócio
│       ├── auth/                 # Autenticação e usuários
│       │   ├── dto/auth.dto.ts
│       │   ├── interfaces/IUserRepository.ts
│       │   ├── repositories/PrismaUserRepository.ts
│       │   └── services/AuthService.ts
│       ├── calculator/           # Calculadora agrícola
│       │   ├── data/crops.ts     # 50+ culturas com dados reais
│       │   ├── interfaces/ICropCalculator.ts
│       │   ├── services/ProductionScalingService.ts
│       │   └── services/ProductionScalingService.test.ts
│       ├── dashboard/            # Agregação de dados do dashboard
│       │   └── services/DashboardService.ts
│       ├── documentation/        # CMS de documentação
│       │   └── repositories/PrismaDocumentationRepository.ts
│       ├── iot/                  # IoT (sensores, alertas, scheduler)
│       │   ├── interfaces/
│       │   │   ├── IAlertRepository.ts
│       │   │   ├── IAlertService.ts
│       │   │   ├── IIotProvider.ts
│       │   │   └── ISensorReadingRepository.ts
│       │   ├── repositories/
│       │   │   ├── PrismaAlertRepository.ts
│       │   │   └── PrismaSensorReadingRepository.ts
│       │   └── services/
│       │       ├── AlertService.ts
│       │       ├── IotIngestionService.ts
│       │       ├── RealIotProvider.ts
│       │       ├── SchedulerService.ts
│       │       ├── SimulationIotProvider.ts
│       │       └── SimulationIotProvider.test.ts
│       ├── lessons/              # CMS de aulas
│       │   └── repositories/PrismaLessonRepository.ts
│       └── users/                # Registros manuais do produtor
│           └── repositories/PrismaManualRecordRepository.ts
│
├── instrumentation.ts            # Inicialização do scheduler no startup
├── next.config.ts                # Config Next.js + security headers
├── nodemon.json                  # Hot-reload config
├── compose.yaml                  # Docker Compose (db + adminer + app)
├── Dockerfile.dev                # Imagem de desenvolvimento
├── .env / .env.example           # Variáveis de ambiente
├── tsconfig.json                 # TypeScript config
├── eslint.config.mjs             # ESLint flat config
└── postcss.config.mjs            # PostCSS + Tailwind
```

---

## 3. Modelo de Dados (Prisma)

> **Fonte:** `prisma/schema.prisma`

### User

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `String @id @default(cuid())` | Identificador único |
| `name` | `String` | Nome completo |
| `email` | `String @unique` | E-mail (único, não deletado) |
| `passwordHash` | `String` | Hash bcrypt da senha |
| `role` | `UserRole @default(USER)` | `USER` ou `SUPER_ADMIN` |
| `isDeleted` | `Boolean @default(false)` | Soft delete |
| `deletedAt` | `DateTime?` | Data de exclusão |
| `createdAt` | `DateTime @default(now())` | |
| `updatedAt` | `DateTime @updatedAt` | |

### SensorReading

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `String @id @default(cuid())` | |
| `sensorType` | `SensorType` (enum) | 11 tipos de sensor |
| `value` | `Float` | Valor lido |
| `source` | `String` | `"simulation"` ou `"real"` |
| `measuredAt` | `DateTime` | Momento da medição |
| `createdAt` | `DateTime @default(now())` | |
| `userId` | `String?` | Dono da leitura (nullable) |

**SensorType enum:** `CHICKEN_TEMPERATURE`, `CHICKEN_LUMINOSITY`, `QUAIL_TEMPERATURE`, `QUAIL_LUMINOSITY`, `WORMFARM_SOIL_TEMPERATURE`, `WORMFARM_SOIL_HUMIDITY`, `COMPOST_TEMPERATURE`, `COMPOST_HUMIDITY`, `PLANTING_SOIL_HUMIDITY`, `FISH_TANK_PH`, `FISH_TANK_WATER_LEVEL`

### Alert

| Campo | Tipo | Descrição |
|---|---|---|
| `type` | `AlertType` | `TEMPERATURE_HIGH`, `TEMPERATURE_LOW`, etc. |
| `severity` | `AlertSeverity` | `INFO`, `WARNING`, `CRITICAL` |
| `sensorType` | `SensorType` | |
| `message` | `String` | Mensagem descritiva |
| `value` | `Float` | Valor que disparou |
| `threshold` | `Float` | Limiar violado |
| `isResolved` | `Boolean @default(false)` | |
| `resolvedAt` | `DateTime?` | |
| `sensorReadingId` | `String?` | Leitura que gerou |
| `userId` | `String?` | Dono do alerta |

**Índices:** `isResolved`, `sensorType`, `createdAt`, `userId`

### ManualRecord

| Campo | Tipo | Descrição |
|---|---|---|
| `type` | `ManualRecordType` (enum) | 14 tipos de registro manual |
| `quantity` | `Float?` | Quantidade |
| `notes` | `String?` | Observações |
| `observedAt` | `DateTime` | Data do evento |
| `userId` | `String` | Dono (obrigatório, não nullable) |
| `isDeleted` | `Boolean @default(false)` | Soft delete |

### Lesson

| Campo | Tipo |
|---|---|
| `title`, `description`, `videoUrl`, `content` | `String` |
| `category` | `LessonCategory` (enum: `CHICKEN`, `QUAIL`, `FISH`, `COMPOST`, `WORM_FARM`, `PLANTING`, `GENERAL`) |
| `slug` | `String @unique` |
| `thumbnailUrl` | `String?` |
| `isDeleted` | `Boolean @default(false)` |

### DocumentationPage

| Campo | Tipo |
|---|---|
| `title`, `description`, `content` | `String` |
| `slug` | `String @unique` |
| `isDeleted` | `Boolean @default(false)` |

### AuditLog

| Campo | Tipo |
|---|---|
| `action`, `entity`, `entityId` | `String` |
| `payload` | `Json?` |
| `userId` | `String?` |

---

## 4. Camada Core

### 4.1 Prisma Client (`src/core/database/prisma.ts`)

Singleton do Prisma Client com cache global para evitar múltiplas conexões em hot-reload.

```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
```

### 4.2 Container DI (`src/core/di/container.ts`)

Container único que instancia todas as dependências:

```typescript
export const container = {
  authService,
  sensorReadingRepository,
  alertRepository,
  alertService,
  dashboardService,
  schedulerService,
  simulationIngestionService,
  realIngestionService,
  productionScalingService,
  lessonRepository,
  documentationRepository,
  manualRecordRepository,
};
```

**Regras de injeção:**
- Repositories dependem apenas do Prisma Client
- Services dependem de interfaces (não de implementações concretas)
- `IotIngestionService` recebe um `IIotProvider` (simulation ou real) + `ISensorReadingRepository` + `IAlertService`
- `SchedulerService` recebe `IotIngestionService` + `IUserRepository`

### 4.3 AppError (`src/core/errors/AppError.ts`)

```typescript
export class AppError extends Error {
  constructor(public readonly statusCode: number, message: string) { ... }
}
```

Usado em toda a camada de serviço. Capturado por `handleHttpError()`.

### 4.4 HTTP Layer

| Arquivo | Funções |
|---|---|
| `auth.ts` | `signAuthToken()` (JWT 12h), `verifyAuthToken()`, `readSession()`, `requireRole()`, `setSessionCookie()` (httpOnly, secure, sameSite strict), `clearSessionCookie()` |
| `rateLimit.ts` | `checkRateLimit(ip)` — 10 tentativas por IP a cada 15 minutos |
| `response.ts` | `handleHttpError(error)` — mapeia `AppError` para resposta JSON, erros não tratados retornam 500 |

### 4.5 Scheduler Init (`src/core/scheduler/init.ts`)

Inicializado via `instrumentation.ts` (Next.js `register()`). Singleton com flag global. Executa apenas no runtime Node.js (não no edge). O scheduler cria leituras para **todos os usuários ativos** a cada 3 horas (8 slots: 00, 03, 06, 09, 12, 15, 18, 21).

### 4.6 Auth Store (`src/store/authStore.ts`)

Zustand store gerenciando estado global de autenticação:

| Ação | Descrição |
|---|---|
| `login(email, password)` | POST /api/auth/login, seta user |
| `register(name, email, password, passwordConfirmation)` | POST /api/auth/register, seta user |
| `logout()` | POST /api/auth/logout, limpa user |
| `fetchProfile()` | GET /api/auth/profile, inicializa sessão |
| `updateProfile(data)` | PATCH /api/auth/profile |

### 4.7 API Helper (`src/lib/api.ts`)

```typescript
export async function api<T>(url: string, options?: ApiOptions): Promise<T>
```

- Define `Content-Type: application/json` automaticamente
- Intercepta 401 → executa `logout()` + redirect para `/login`
- Parse de erro unificado

---

## 5. Módulos de Negócio

### 5.1 Módulo Auth

**DTOs** (`src/modules/auth/dto/auth.dto.ts`):

| Schema | Campos | Validações |
|---|---|---|
| `registerSchema` | name, email, password, passwordConfirmation | name 3-120 chars, email válido (max 254), password 8-128 chars, confirmação deve coincidir |
| `loginSchema` | email, password | email válido (max 254), password obrigatória (max 128) |
| `updateProfileSchema` | name?, email? | name 3-120, email válido (max 254) |

**AuthService** — Operações:

| Método | Descrição |
|---|---|
| `register(input)` | Verifica e-mail duplicado (mensagem genérica), hash bcrypt(10), cria usuário com role USER, retorna token |
| `login(input)` | Busca por e-mail, compara bcrypt, retorna token |
| `getProfile(userId)` | Busca por ID |
| `updateProfile(userId, input)` | Atualiza nome/e-mail |
| `softDeleteUser(userId)` | Soft delete |
| `listUsers()` | Lista ativos |

### 5.2 Módulo IoT

**Arquitetura de providers (Strategy Pattern):**

```
IIotProvider (interface)
├── SimulationIotProvider  → gera valores aleatórios dentro de ranges realistas
└── RealIotProvider        → busca de API externa (IOT_API_BASE_URL)
```

**IotIngestionService** — Fluxo completo:
1. Lê de um `IIotProvider`
2. Salva `SensorReading` no banco
3. Chama `AlertService.checkThreshold()` para cada leitura
4. Se threshold violado, cria `Alert`

**AlertService** — Thresholds por sensor:

| SensorType | Threshold |
|---|---|
| CHICKEN_TEMPERATURE | 15–32 °C |
| CHICKEN_LUMINOSITY | min 50 lux |
| QUAIL_TEMPERATURE | 18–30 °C |
| QUAIL_LUMINOSITY | min 50 lux |
| WORMFARM_SOIL_TEMPERATURE | 15–30 °C |
| WORMFARM_SOIL_HUMIDITY | 60–85% |
| COMPOST_TEMPERATURE | 30–70 °C |
| COMPOST_HUMIDITY | 40–65% |
| PLANTING_SOIL_HUMIDITY | 40–80% |
| FISH_TANK_PH | 6.0–8.5 |
| FISH_TANK_WATER_LEVEL | min 30 cm |

**SchedulerService:**
- Cron com 8 slots diários (00, 03, 06, 09, 12, 15, 18, 21)
- `runForAllUsers()` — busca todos os usuários ativos e cria leituras para cada um
- `pause()` / `resume()` — controle de estado
- `getStatus()` — retorna `{ isRunning, isPaused, schedule }`

### 5.3 Módulo Calculator

**Base de dados** (`src/modules/calculator/data/crops.ts`):
- 50 culturas com dados reais (fonte: Embrapa Hortaliças)
- Campos por cultura: produção/m² (kg ou unidades), espaçamento, ciclo, época de plantio por região, tipo de plantio
- Regiões: Sul, Sudeste, Centro-Oeste, Nordeste, Norte
- Culturas com produção em unidades (pés, molhos, espigas) convertidas para kg estimados

**ProductionScalingService** — Algoritmo:

```
1. Usuário informa: cultura, kg/semana, região
2. Sistema busca cultura e calcula:
   m²/semana = kg/desejado ÷ produção_média_por_m²
   plantas/semana = m² ÷ (espaçamento_linha × espaçamento_planta ÷ 10000)
3. Escalonamento:
   intervalo = 7 dias (semanal)
   semanas_simultâneas = ceil(ciclo_médio / 7)
4. Output: área/plantas por semana, total ocupado, instrução de plantio
```

### 5.4 Módulo Dashboard

**DashboardService:**
- `getSummary(userId)` — última leitura de cada sensor + contagem de alertas ativos
- `getStats(sensorType, userId, startDate?, endDate?)` — média, mínima, máxima, contagem
- `getHistoricalData(sensorType, userId, period)` — série temporal (24h, 7d, 30d)

### 5.5 Módulos de Conteúdo (Lessons & Documentation)

Ambos seguem o mesmo padrão:
- Repository com CRUD + soft delete
- Slug automático (gerado a partir do título)
- Busca por slug nas páginas públicas
- Admin protegido por `requireRole([SUPER_ADMIN])`

### 5.6 Módulo Users (Manual Records)

**PrismaManualRecordRepository:**
- `findByUser(userId)` — lista registros ativos do usuário
- `create(data)` — cria com userId
- `update(id, userId, data)` — atualiza verificando dono
- `softDelete(id, userId)` — soft delete verificando dono

---

## 6. API Routes

### 6.1 Autenticação

| Rota | Métodos | Auth | Descrição |
|---|---|---|---|
| `/api/auth/login` | POST | — | Login (rate-limited: 10/15min) |
| `/api/auth/register` | POST | — | Cadastro (rate-limited) |
| `/api/auth/logout` | POST | — | Logout |
| `/api/auth/profile` | GET, PATCH | `readSession` | Perfil (GET com Cache-Control: no-store) |

### 6.2 Dashboard

| Rota | Métodos | Auth | Descrição |
|---|---|---|---|
| `/api/dashboard/summary` | GET | `readSession` | Resumo completo do dashboard |
| `/api/dashboard/stats` | GET | `readSession` | Estatísticas de um sensor |
| `/api/dashboard/historical` | GET | `readSession` | Dados históricos (24h/7d/30d) |

### 6.3 IoT

| Rota | Métodos | Auth | Descrição |
|---|---|---|---|
| `/api/iot/refresh` | POST | `readSession` | Gera leituras simuladas para o usuário |
| `/api/iot/readings` | GET | `readSession` | Leitura única de um sensor |
| `/api/iot/history` | GET | `readSession` | Histórico paginado (limit 1-500) |
| `/api/iot/ingest` | POST | `requireRole([SUPER_ADMIN])` | Ingestão manual (real ou simulação) |

### 6.4 Alertas

| Rota | Métodos | Auth | Descrição |
|---|---|---|---|
| `/api/alerts` | GET | `readSession` | Alertas ativos do usuário |
| `/api/alerts/[id]` | PATCH | `requireRole([SUPER_ADMIN])` | Resolver alerta |

### 6.5 Calculadora

| Rota | Métodos | Auth | Descrição |
|---|---|---|---|
| `/api/calculator/production-scaling` | POST | — | Calcular escalonamento |

### 6.6 Conteúdo

| Rota | Métodos | Auth | Descrição |
|---|---|---|---|
| `/api/lessons` | GET, POST | POST: SUPER_ADMIN | Listar/criar aulas |
| `/api/lessons/[id]` | PATCH, DELETE | SUPER_ADMIN | Atualizar/excluir aula |
| `/api/docs` | GET, POST | POST: SUPER_ADMIN | Listar/criar docs |
| `/api/docs/[id]` | PATCH, DELETE | SUPER_ADMIN | Atualizar/excluir doc |

### 6.7 Registros Manuais

| Rota | Métodos | Auth | Descrição |
|---|---|---|---|
| `/api/manual-records` | GET, POST | `readSession` | Listar/criar registros |
| `/api/manual-records/[id]` | PATCH, DELETE | `readSession` | Atualizar/excluir (dono) |

### 6.8 Administração

| Rota | Métodos | Auth | Descrição |
|---|---|---|---|
| `/api/scheduler` | GET, POST | SUPER_ADMIN | Status / execução manual |
| `/api/scheduler/pause` | POST | SUPER_ADMIN | Pausar scheduler |
| `/api/scheduler/resume` | POST | SUPER_ADMIN | Retomar scheduler |
| `/api/users` | GET | SUPER_ADMIN | Listar usuários |
| `/api/users/[id]` | DELETE | SUPER_ADMIN | Soft delete usuário |

### 6.9 Páginas Públicas

| Rota | Descrição |
|---|---|
| `GET /aulas/[slug]` | Server component, busca por slug, 404 se não encontrado |
| `GET /docs/[slug]` | Server component, busca por slug, 404 se não encontrado |

---

## 7. Páginas (Frontend)

### 7.1 Páginas Públicas

| Página | Rota | Descrição |
|---|---|---|
| Home | `/` | Cards de acesso aos módulos |
| Login | `/login` | Formulário de autenticação |
| Register | `/register` | Cadastro com confirmação de senha |
| Aula | `/aulas/[slug]` | Conteúdo de aula (SSR) |
| Documentação | `/docs/[slug]` | Conteúdo de documentação (SSR) |

### 7.2 Páginas Protegidas (AuthGuard)

Todas exigem `AuthGuard` que redireciona para `/login` se não autenticado.

| Página | Rota | Descrição |
|---|---|---|
| Dashboard | `/dashboard` | Server component + RefreshDashboardButton |
| Leituras | `/readings` | Histórico com filtros e refresh |
| Alertas | `/alerts` | Lista de alertas com resolução |
| Registros | `/manual-records` | CRUD com busca, filtro, ordenação, toggle visualização |
| Calculadora | `/calculator` | Autocomplete + inputs + resultado |
| Perfil | `/profile` | Visualizar/editar nome e e-mail |

### 7.3 Páginas Administrativas (AuthGuard + role SUPER_ADMIN no backend)

| Página | Rota | Descrição |
|---|---|---|
| Scheduler | `/admin/scheduler` | Status, pause/resume, trigger manual |
| IoT | `/admin/iot` | Ingestão manual de leituras |
| Aulas | `/admin/lessons` | CRUD de aulas |
| Docs | `/admin/docs` | CRUD de documentação |
| Usuários | `/admin/users` | Listagem e exclusão |

---

## 8. Componentes UI (Design System)

> **Fonte:** `src/components/ui/*`

### Tokens CSS (`app/globals.css`)

```css
:root {
  --color-bg: #f9fafb;
  --color-surface: #ffffff;
  --color-border: #e5e7eb;
  --color-border-hover: #d1d5db;
  --color-text: #111827;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-primary-soft: #eef2ff;
  --color-accent: #f59e0b;
  --color-danger: #ef4444;
  --color-danger-soft: #fef2f2;
  --color-warning: #f59e0b;
  --color-warning-soft: #fffbeb;
  --color-info: #3b82f6;
  --color-info-soft: #eff6ff;
  --color-success: #10b981;
  --color-success-soft: #ecfdf5;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
}
```

### Componentes

| Componente | Props | Variantes |
|---|---|---|
| **Button** | variant, size, loading, disabled, className | `primary`, `secondary`, `ghost`, `danger`; sm, md |
| **Input** | error, helperText, ...input | forwardRef, focus ring |
| **Select** | error, ...select | forwardRef, mesma altura do Input |
| **Textarea** | error, ...textarea | forwardRef, resize-y |
| **Card** | padding, className | sm (px-4 py-3), md (p-5), lg (p-6) |
| **Badge** | variant, children | `neutral`, `info`, `warning`, `danger`, `success` |
| **AlertBanner** | variant, onDismiss, children | `success`, `error`, `warning`, `info` |
| **PageHeader** | title, description, children | description aceita `string` ou `ReactNode` |
| **Spinner** | className | SVG animado |
| **PageLoading** | — | Spinner centralizado |

### Navegação

**Header** (`src/components/navigation/Header.tsx`):
- Links condicionais por role (admin visível apenas para SUPER_ADMIN)
- Menu hamburguer em mobile
- Avatar com iniciais do usuário
- Link "Leituras" incluso

---

## 9. Segurança

### Medidas implementadas

| Medida | Implementação |
|---|---|
| **Senha com hash** | bcryptjs com 10 rounds de salt |
| **Confirmação de senha** | Frontend + backend (Zod `.refine()`) |
| **JWT httpOnly** | Cookie não acessível via JavaScript |
| **SameSite Strict** | Cookie restrito ao mesmo site (CSRF) |
| **Secure em produção** | Cookie apenas via HTTPS |
| **Expiração JWT** | 12 horas |
| **Rate limiting** | 10 tentativas/15min por IP em login e register |
| **Security headers** | X-Content-Type-Options, X-Frame-Options, Referrer-Policy (via next.config.ts) |
| **Anti-enumeration** | Mensagem genérica em e-mail duplicado no registro |
| **Role fixa no registro** | Usuários sempre criados como USER (impossível auto-promover) |
| **Validação Zod** | Todos inputs validados com tipos, tamanhos, formatos |
| **Soft delete** | Usuários, aulas, docs, registros — nunca deletados fisicamente |
| **Cache-Control** | Perfil do usuário com `no-store` |
| **JWT_SECRET validation** | Em produção, rejeita se for o valor padrão |
| **Auth via sessão** | `readSession()` lê cookie JWT em rotas protegidas |
| **Autorização por role** | `requireRole()` verifica SUPER_ADMIN em rotas administrativas |
| **Escopo por usuário** | Todas queries de sensor/alertas filtradas por `userId` |

### Riscos remanescentes (não tratados)

- Sem CSP (Content-Security-Policy) header — conteúdo de aulas/docs pode conter scripts
- Sem lockout de conta — apenas rate limit por IP
- Auditoria (AuditLog) existe no schema mas não é populada

---

## 10. Infraestrutura & DevOps

### Docker Compose

```yaml
services:
  db:         # PostgreSQL 14 Alpine (porta 5435)
  adminer:    # Adminer (porta 8080)
  app:        # Aplicação Next.js (porta 3000) com hot-reload via volume bind
```

`Dockerfile.dev`:
- Base `node:20-alpine`
- `npm ci` para instalar dependências
- `CMD` executa `next dev --turbopack` com host 0.0.0.0
- Volumes: `/app` bind, `/app/node_modules` e `/app/.next` anônimos (persistência)

### Hot-reload (fora do Docker)

```bash
npm run dev          # next dev --turbopack
npm run dev:nodemon  # nodemon → next dev (reinicia em alterações em src/, app/, prisma/)
```

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `DATABASE_URL` | Conexão PostgreSQL | `postgresql://postgres:password@localhost:5435/sisteminha_embrapa` |
| `JWT_SECRET` | Chave secreta JWT | (obrigatório configurar) |
| `IOT_API_BASE_URL` | URL da API IoT externa | `http://localhost:8080/api` |
| `NODE_ENV` | Ambiente | definido automaticamente |
| `SCHEDULER_ENABLED` | Ativar scheduler | `false` (Docker) |

---

## 11. Scripts & Qualidade

### Scripts npm

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Turbopack) |
| `npm run dev:nodemon` | Dev com nodemon (reinício automático) |
| `npm run dev:docker` | Dev com host 0.0.0.0 (Docker) |
| `npm run build` | Build de produção |
| `npm start` | Servidor de produção |
| `npm run lint` | ESLint |
| `npm test` | Testes unitários (tsx --test) |
| `npm run prisma:generate` | Gerar Prisma Client |
| `npm run prisma:migrate` | Rodar migrações |
| `npm run prisma:seed` | Seed inicial (admin@sisteminha.local / admin123456) |

### Testes Unitários

```
npm test
✓ ProductionScalingService — 4 testes (cálculo milho, tomate, cultura inexistente, kg zero)
✓ SimulationIotProvider — 1 teste (valor dentro do range esperado)
```

---

## 12. Guia de Extensibilidade

### Adicionar nova cultura na calculadora

Editar `src/modules/calculator/data/crops.ts`:

```typescript
{
  nome: 'Nova Cultura',
  producao_por_m2: [2.0, 3.5],      // kg/m² ou null se for por planta
  producao_por_planta: null,          // null se for m²
  producao_display: '2,0 a 3,5 kg/m²',
  espacamento_linha_cm: 80,
  espacamento_planta_cm: 40,
  dias_colheita: [90, 120],
  epocas_plantio: {
    Sul: 'Set-Out',
    Sudeste: 'Out-Nov',
    'Centro-Oeste': 'Out-Dez',
    Nordeste: 'Jan-Mar',
    Norte: 'Jan-Abr',
  },
  tipo_plantio: 'm2',                  // 'm2' ou 'planta'
  tipo_plantio_desc: 'Semeadura direta / sulco',
},
```

### Adicionar novo tipo de sensor

1. Adicionar valor ao enum `SensorType` em `schema.prisma`
2. Rodar `npm run prisma:migrate`
3. Adicionar threshold em `AlertService.ts` (`sensorThresholds` map)
4. Adicionar range em `SimulationIotProvider.ts` (`sensorRanges` map)
5. Adicionar label em `app/alerts/page.tsx` (`sensorLabels`)
6. Adicionar unidade em `app/readings/page.tsx` (`sensorUnits`)

### Adicionar nova funcionalidade (ex: novo módulo)

1. Criar diretório em `src/modules/<nome>/`
2. Definir interfaces
3. Implementar repository (Prisma)
4. Implementar service
5. Adicionar ao container em `src/core/di/container.ts`
6. Criar API route em `app/api/<nome>/route.ts`
7. Criar página em `app/<nome>/page.tsx`
8. Adicionar link no Header (se necessário)

### Padrões de código

- **Interfaces** em `interfaces/` — definem contratos
- **DTOs** em `dto/` — schemas Zod para validação
- **Repositories** em `repositories/` — acesso a dados (Prisma)
- **Services** em `services/` — lógica de negócio
- **Nomes de arquivo**: PascalCase para componentes, camelCase para o resto
- **Imports**: path alias `@/` mapeia para raiz do projeto

---

> **Documentação gerada em:** Junho 2026  
> **Repositório:** `sisteminha-embrapa`  
> **Stack:** Next.js 15.5 · TypeScript 5 · Prisma 6 · PostgreSQL 14 · Tailwind CSS 4
