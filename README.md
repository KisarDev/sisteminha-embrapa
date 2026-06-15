# Sisteminha Embrapa

Base profissional em **Next.js (App Router) + TypeScript + Prisma + MVC + Service Layer + Repository Pattern + DI**.

## Stack
- Next.js
- React
- TypeScript (strict)
- Prisma ORM (PostgreSQL)

## Setup
1. Copie `.env.example` para `.env` e ajuste variáveis.
2. Instale dependências:
   ```bash
   npm install
   ```
3. Gere o client Prisma:
   ```bash
   npm run prisma:generate
   ```
4. Rode migrações:
   ```bash
   npm run prisma:migrate
   ```
5. (Opcional) Seed inicial (SUPER_ADMIN):
   ```bash
   npm run prisma:seed
   ```
6. Suba o ambiente:
   ```bash
   npm run dev
   ```

## Estrutura
- `src/modules/*` separados por contexto e camadas:
  - `controllers`
  - `services`
  - `repositories`
  - `interfaces`
  - `entities`
  - `dto`
  - `validators`
  - `routes`

## Funcionalidades base implementadas
- Autenticação: cadastro, login, logout, perfil
- Permissões USER e SUPER_ADMIN
- Soft delete para usuários, aulas, docs e registros manuais
- IoT desacoplado via `IIotProvider` com:
  - `RealIotProvider`
  - `SimulationIotProvider`
- Persistência de leituras IoT
- CRUD de registros manuais
- Calculator (escalonamento de produção)
- CMS de aulas e documentação com rotas dinâmicas (`/aulas/[slug]`, `/docs/[slug]`)

## Qualidade
```bash
npm run lint
npm run test
npm run build
```
