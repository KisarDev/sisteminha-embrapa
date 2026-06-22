import cron, { ScheduledTask } from "node-cron";
import { IotIngestionService, DEFAULT_SENSOR_TYPES } from "@/src/modules/iot/services/IotIngestionService";
import { IUserRepository } from "@/src/modules/auth/interfaces/IUserRepository";

type ScheduleDefinition = {
  label: string;
  expression: string;
};

const SCHEDULES: ScheduleDefinition[] = [
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
  private lastRunCount = 0;

  constructor(
    private readonly ingestionService: IotIngestionService,
    private readonly userRepository: IUserRepository,
  ) {}

  initialize() {
    if (this.initialized) return;

    for (const schedule of SCHEDULES) {
      const task = cron.schedule(schedule.expression, () => {
        this.runForAllUsers().catch((error) =>
          console.error(`[scheduler] Falha na leitura agendada ${schedule.label}:`, error),
        );
      }, { timezone: "America/Sao_Paulo" });

      this.tasks.set(schedule.label, task);
    }

    this.initialized = true;

    if (!this.isEnabled()) this.pause();
  }

  async runForAllUsers() {
    const allUsers = await this.userRepository.findMany();
    let totalReadings = 0;

    for (const user of allUsers) {
      const readings = await this.ingestionService.ingest(DEFAULT_SENSOR_TYPES, user.id);
      totalReadings += readings.length;
    }

    this.lastRunAt = new Date();
    this.lastRunCount = totalReadings;
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
      schedules: SCHEDULES,
      lastRunAt: this.lastRunAt,
      lastRunCount: this.lastRunCount,
    };
  }

  private isEnabled() {
    return process.env.SCHEDULER_ENABLED !== "false";
  }
}