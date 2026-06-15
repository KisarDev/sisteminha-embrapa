import { AuthService } from "@/src/modules/auth/services/AuthService";
import { PrismaUserRepository } from "@/src/modules/auth/repositories/PrismaUserRepository";
import { PrismaSensorReadingRepository } from "@/src/modules/iot/repositories/PrismaSensorReadingRepository";
import { SimulationIotProvider } from "@/src/modules/iot/services/SimulationIotProvider";
import { RealIotProvider } from "@/src/modules/iot/services/RealIotProvider";
import { IotIngestionService } from "@/src/modules/iot/services/IotIngestionService";
import { ProductionScalingService } from "@/src/modules/calculator/services/ProductionScalingService";
import { PrismaLessonRepository } from "@/src/modules/lessons/repositories/PrismaLessonRepository";
import { PrismaDocumentationRepository } from "@/src/modules/documentation/repositories/PrismaDocumentationRepository";
import { PrismaManualRecordRepository } from "@/src/modules/users/repositories/PrismaManualRecordRepository";

const userRepository = new PrismaUserRepository();
const sensorReadingRepository = new PrismaSensorReadingRepository();

export const container = {
  authService: new AuthService(userRepository),
  sensorReadingRepository,
  simulationIngestionService: new IotIngestionService(new SimulationIotProvider(), sensorReadingRepository),
  realIngestionService: new IotIngestionService(new RealIotProvider(), sensorReadingRepository),
  productionScalingService: new ProductionScalingService(),
  lessonRepository: new PrismaLessonRepository(),
  documentationRepository: new PrismaDocumentationRepository(),
  manualRecordRepository: new PrismaManualRecordRepository(),
};
