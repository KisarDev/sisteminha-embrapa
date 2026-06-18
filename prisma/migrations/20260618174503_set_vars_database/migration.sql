-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "LessonCategory" AS ENUM ('CHICKEN', 'QUAIL', 'FISH', 'COMPOST', 'WORM_FARM', 'PLANTING', 'GENERAL');

-- CreateEnum
CREATE TYPE "ManualRecordType" AS ENUM ('CHICKEN_EGGS', 'QUAIL_EGGS', 'CHICKEN_FEED_CONVERSION', 'QUAIL_FEED_CONVERSION', 'FISH_FEED_CONVERSION', 'HUMUS_AMOUNT', 'COMPOST_AMOUNT', 'FISH_HARVEST_AMOUNT', 'SLAUGHTERED_BIRDS_AMOUNT', 'PLANTING_EVENT', 'HARVEST_EVENT', 'SEED_AMOUNT', 'OBSERVATION', 'FREE_NOTE');

-- CreateEnum
CREATE TYPE "SensorType" AS ENUM ('CHICKEN_TEMPERATURE', 'CHICKEN_LUMINOSITY', 'QUAIL_TEMPERATURE', 'QUAIL_LUMINOSITY', 'WORMFARM_SOIL_TEMPERATURE', 'WORMFARM_SOIL_HUMIDITY', 'COMPOST_TEMPERATURE', 'COMPOST_HUMIDITY', 'PLANTING_SOIL_HUMIDITY', 'FISH_TANK_PH', 'FISH_TANK_WATER_LEVEL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorReading" (
    "id" TEXT NOT NULL,
    "sensorType" "SensorType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SensorReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualRecord" (
    "id" TEXT NOT NULL,
    "type" "ManualRecordType" NOT NULL,
    "quantity" DOUBLE PRECISION,
    "notes" TEXT,
    "observedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManualRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "category" "LessonCategory" NOT NULL DEFAULT 'GENERAL',
    "thumbnailUrl" TEXT,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentationPage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentationPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "payload" JSONB,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentationPage_slug_key" ON "DocumentationPage"("slug");

-- AddForeignKey
ALTER TABLE "ManualRecord" ADD CONSTRAINT "ManualRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
