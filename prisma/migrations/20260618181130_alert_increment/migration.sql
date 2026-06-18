-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('TEMPERATURE_HIGH', 'TEMPERATURE_LOW', 'LUMINOSITY_LOW', 'PH_OUT_OF_RANGE', 'WATER_LEVEL_LOW', 'SOIL_DRY', 'HUMIDITY_HIGH', 'HUMIDITY_LOW');

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "sensorType" "SensorType" NOT NULL,
    "message" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "sensorReadingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Alert_isResolved_idx" ON "Alert"("isResolved");

-- CreateIndex
CREATE INDEX "Alert_sensorType_idx" ON "Alert"("sensorType");

-- CreateIndex
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_sensorReadingId_fkey" FOREIGN KEY ("sensorReadingId") REFERENCES "SensorReading"("id") ON DELETE SET NULL ON UPDATE CASCADE;
