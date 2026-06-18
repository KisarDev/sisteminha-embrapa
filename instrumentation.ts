import { initScheduler } from "@/src/core/scheduler/init";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    initScheduler();
  }
}