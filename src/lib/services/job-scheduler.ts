// ---------------------------------------------------------------------------
// Lightweight In-Process Job Scheduler
// ---------------------------------------------------------------------------

type Job = {
  id: string;
  name: string;
  handler: () => Promise<void>;
  intervalMs: number;
  lastRun?: Date;
  nextRun?: Date;
  running: boolean;
  enabled: boolean;
};

class JobScheduler {
  private jobs: Map<string, Job> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  register(
    name: string,
    handler: () => Promise<void>,
    intervalMs: number
  ): void {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    this.jobs.set(id, {
      id,
      name,
      handler,
      intervalMs,
      running: false,
      enabled: true,
    });
  }

  start(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    // Clear any existing timer
    this.stop(jobId);

    job.enabled = true;

    const run = async () => {
      if (!job.enabled || job.running) return;

      job.running = true;
      job.lastRun = new Date();

      try {
        await job.handler();
      } catch (error) {
        console.error(`[job-scheduler] Job "${job.name}" failed:`, error);
      } finally {
        job.running = false;
        if (job.enabled) {
          job.nextRun = new Date(Date.now() + job.intervalMs);
        }
      }
    };

    // Run immediately then schedule subsequent runs
    run();
    const timer = setInterval(run, job.intervalMs);
    this.timers.set(jobId, timer);
    job.nextRun = new Date(Date.now() + job.intervalMs);
  }

  stop(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.enabled = false;
      job.nextRun = undefined;
    }

    const timer = this.timers.get(jobId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(jobId);
    }
  }

  startAll(): void {
    for (const jobId of this.jobs.keys()) {
      this.start(jobId);
    }
  }

  stopAll(): void {
    for (const jobId of this.jobs.keys()) {
      this.stop(jobId);
    }
  }

  getStatus(): {
    id: string;
    name: string;
    lastRun?: Date;
    nextRun?: Date;
    running: boolean;
    enabled: boolean;
    intervalMs: number;
  }[] {
    return Array.from(this.jobs.values()).map((job) => ({
      id: job.id,
      name: job.name,
      lastRun: job.lastRun,
      nextRun: job.nextRun,
      running: job.running,
      enabled: job.enabled,
      intervalMs: job.intervalMs,
    }));
  }
}

export const scheduler = new JobScheduler();

// ---------------------------------------------------------------------------
// Register default jobs
// ---------------------------------------------------------------------------

scheduler.register(
  "analytics-sync",
  async () => {
    console.log("[job] Syncing analytics...");
    // In production: call streamingService.aggregateStats for all users
  },
  3600000 // 1 hour
);

scheduler.register(
  "social-post-processor",
  async () => {
    console.log("[job] Processing scheduled posts...");
    // In production: call socialService.processScheduledPosts
  },
  60000 // 1 minute
);

scheduler.register(
  "ai-daily-scan",
  async () => {
    console.log("[job] Running AI daily scan...");
    // In production: call aiAutopilotService.scanArtistState for active users
  },
  86400000 // 24 hours
);

scheduler.register(
  "opportunity-scanner",
  async () => {
    console.log("[job] Scanning for opportunities...");
    // In production: scan for new playlist, sync, and collab opportunities
  },
  21600000 // 6 hours
);

scheduler.register(
  "weekly-report-generator",
  async () => {
    console.log("[job] Generating weekly reports...");
    // In production: generate and email weekly reports
  },
  604800000 // 7 days
);
