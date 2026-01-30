text
# ProductManagement API

[NestJS + Prisma + PostgreSQL + JWT + Docker](#productmanagement-api)

## Описание

REST API для управления товарами с полной системой ролей (ADMIN/USER). Админы могут создавать товары, все пользователи — просматривать. Полная JWT аутентификация, защита эндпоинтов Guards, Swagger документация и Docker контейнеризация.

## Технологии

- NestJS 11 — Node.js фреймворк с TypeScript
- Prisma 5.22 + PostgreSQL 16 — база данных и ORM
- Passport.js JWT — аутентификация + RolesGuard
- Swagger — документация API (`/api`)
- Docker — контейнеризация (main + postgres)

## Установка и запуск

Клонируйте репозиторий:
```bash
git clone <repo-url>
cd backend
Запустите через Docker:

bash
docker-compose up --build
В новом терминале создайте таблицы:

bash
docker-compose exec main npx prisma db push
Откройте в браузере Swagger UI:

text
http://localhost:8080/api
Основные возможности API
JWT аутентификация + роли ADMIN/USER

CRUD товары (только ADMIN создает)

Guards защита (@UseGuards(JwtAuthGuard, RolesGuard))

PostgreSQL с Prisma ORM

Swagger с Bearer токенами

Hot reload в Docker dev

Архитектура
text
Модули NestJS: Auth, Users, Products
Guards: JwtAuthGuard → RolesGuard (JWT → Роли)
Prisma: User {roles: Json["ADMIN"]} → Product{createdById}
Swagger: @ApiBearerAuth() + addBearerAuth()