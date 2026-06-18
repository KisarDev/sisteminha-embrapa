import { container } from "@/src/core/di/container";

declare global {
  var sisteminhaSchedulerInitialized: boolean | undefined;
}

export function initScheduler() {
  if (global.sisteminhaSchedulerInitialized) {
    return;
  }

  container.schedulerService.initialize();
  global.sisteminhaSchedulerInitialized = true;
}