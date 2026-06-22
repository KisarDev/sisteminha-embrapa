import cron, { ScheduledTask } from "node-cron";
import { SensorType } from "@prisma/client";
import { IotIngestionService, DEFAULT_SENSOR_TYPES } from "@/src/modules/iot/services/IotIngestionService";
import { IUserRepository } from "@/src/modules/auth/interfaces/IUserRepository";

type SchedulerSource = "real" | "simulation";

type ScheduleDefinition = {
  label: string;
  expression: string;
};

const DEFAULT_SCHEDULES: ScheduleDefinition[] = [
  { label: "00:00", expression: "0 0 * * *" },
  { label: "03:00", expression: "0 3 * * *" },
  { label: "06:00", expression: "0 6 * * *" },
  { label: "09:00", expression: "0 9 * * *" },
  { label: "12:00", expression: "0 12 * * *" },
  { label: "15:00", expression: "0 15 * * *" },
  { label: "18:00", expression: "0 18 * * *" },
  { label: "21:00", expression: "0 21 * * *" },
];

export class SchedulerService {
  private readonly tasks = new Map<string, ScheduledTask>();
  private initialized = false;
  private paused = false;
  private lastRunAt: Date | null = null;
  private lastRunSource: SchedulerSource | null = null;
  private lastRunCount = 0;

  constructor(
    private readonly simulationIngestionService: IotIngestionService,
    private readonly realIngestionService: IotIngestionService,
    private readonly userRepository: IUserRepository,
  ) {}

  initialize() {
    if (this.initialized) {
      return;
    }

    for (const schedule of DEFAULT_SCHEDULES) {
      const task = cron.schedule(schedule.expression, async () => {
        try {
          await this.runScheduledIngestion();
        } catch (error) {
          console.error(`[scheduler] Falha na leitura agendada ${schedule.label}:`, error);
        }
      }, {
        timezone: "America/Sao_Paulo",
      });

      this.tasks.set(schedule.label, task);
    }

    this.initialized = true;

    if (!this.isEnabled()) {
      this.pause();
    }
  }

  async triggerManual(source?: SchedulerSource, sensorTypes: SensorType[] = DEFAULT_SENSOR_TYPES) {
    this.initialize();

    const selectedSource = source ?? this.getSource();
    const service = this.resolveService(selectedSource);
    const allUsers = await this.userRepository.findMany();

    let totalReadings = 0;
    for (const user of allUsers) {
      const readings = await service.ingest(sensorTypes, user.id);
      totalReadings += readings.length;
    }

    this.lastRunAt = new Date();
    this.lastRunSource = selectedSource;
    this.lastRunCount = totalReadings;

    return [];
  }

  pause() {
    this.initialize();
    this.tasks.forEach((task) => task.stop());
    this.paused = true;
  }

  resume() {
    this.initialize();
    this.tasks.forEach((task) => task.start());
    this.paused = false;
  }

  getStatus() {
    this.initialize();

    return {
      enabled: this.isEnabled(),
      initialized: this.initialized,
      paused: this.paused,
      source: this.getSource(),
      timezone: "America/Sao_Paulo",
      schedules: DEFAULT_SCHEDULES,
      lastRunAt: this.lastRunAt,
      lastRunSource: this.lastRunSource,
      lastRunCount: this.lastRunCount,
    };
  }

  private async runScheduledIngestion() {
    const source = this.getSource();
    const service = this.resolveService(source);
    const allUsers = await this.userRepository.findMany();

    let totalReadings = 0;
    for (const user of allUsers) {
      const readings = await service.ingest(DEFAULT_SENSOR_TYPES, user.id);
      totalReadings += readings.length;
    }

    this.lastRunAt = new Date();
    this.lastRunSource = source;
    this.lastRunCount = totalReadings;
  }

  private resolveService(source: SchedulerSource) {
    return source === "real" ? this.realIngestionService : this.simulationIngestionService;
  }

  private isEnabled() {
    return process.env.SCHEDULER_ENABLED !== "false";
  }

  private getSource(): SchedulerSource {
    return process.env.IOT_SCHEDULER_SOURCE === "real" ? "real" : "simulation";
  }
}