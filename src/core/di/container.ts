import { AuthService } from "@/src/modules/auth/services/AuthService";
import { PrismaUserRepository } from "@/src/modules/auth/repositories/PrismaUserRepository";
import { PrismaSensorReadingRepository } from "@/src/modules/iot/repositories/PrismaSensorReadingRepository";
import { PrismaAlertRepository } from "@/src/modules/iot/repositories/PrismaAlertRepository";
import { SimulationIotProvider } from "@/src/modules/iot/services/SimulationIotProvider";
import { RealIotProvider } from "@/src/modules/iot/services/RealIotProvider";
import { IotIngestionService } from "@/src/modules/iot/services/IotIngestionService";
import { AlertService } from "@/src/modules/iot/services/AlertService";
import { SchedulerService } from "@/src/modules/iot/services/SchedulerService";
import { DashboardService } from "@/src/modules/dashboard/services/DashboardService";
import { ProductionScalingService } from "@/src/modules/calculator/services/ProductionScalingService";
import { PrismaLessonRepository } from "@/src/modules/lessons/repositories/PrismaLessonRepository";
import { PrismaDocumentationRepository } from "@/src/modules/documentation/repositories/PrismaDocumentationRepository";
import { PrismaManualRecordRepository } from "@/src/modules/users/repositories/PrismaManualRecordRepository";

const userRepository = new PrismaUserRepository();
const sensorReadingRepository = new PrismaSensorReadingRepository();
const alertRepository = new PrismaAlertRepository();
const alertService = new AlertService(alertRepository);
const dashboardService = new DashboardService(sensorReadingRepository);
const simulationIngestionService = new IotIngestionService(new SimulationIotProvider(), sensorReadingRepository, alertService);
const realIngestionService = new IotIngestionService(new RealIotProvider(), sensorReadingRepository, alertService);
const schedulerService = new SchedulerService(
  simulationIngestionService,
  realIngestionService,
  userRepository,
);

export const container = {
  authService: new AuthService(userRepository),
  sensorReadingRepository,
  alertRepository,
  alertService,
  dashboardService,
  schedulerService,
  simulationIngestionService,
  realIngestionService,
  productionScalingService: new ProductionScalingService(),
  lessonRepository: new PrismaLessonRepository(),
  documentationRepository: new PrismaDocumentationRepository(),
  manualRecordRepository: new PrismaManualRecordRepository(),
};
