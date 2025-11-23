// backend/src/data/MockJobs.ts
import { v4 as uuidv4 } from 'uuid'; // We need to install this library next

export type JobType = "Training" | "Inference";
export type JobStatus = "Running" | "Paused" | "Completed" | "Migrated";

export interface ComputeJob {
  id: string;
  type: JobType;
  powerConsumptionKw: number; // How much juice it needs
  status: JobStatus;
  urgency: "High" | "Low";    // High = Cannot pause. Low = Can pause.
  location: "London" | "Iceland"; // Default London
}

export class JobQueue {
  private jobs: ComputeJob[] = [];

  constructor() {
    this.generateInitialLoad();
  }

  private generateInitialLoad() {
    // 1. Critical Inference Job (e.g., ChatGPT for users)
    this.jobs.push({
      id: "job-critical-1",
      type: "Inference",
      powerConsumptionKw: 50,
      status: "Running",
      urgency: "High",
      location: "London"
    });

    // 2. Huge Training Job (e.g., GPT-5 Training)
    // This is the one we want to PAUSE when price is high
    this.jobs.push({
      id: "job-training-alpha",
      type: "Training",
      powerConsumptionKw: 500, // Big power draw
      status: "Running",
      urgency: "Low",
      location: "London"
    });

    // 3. Medium Job
    this.jobs.push({
      id: "job-analytics-daily",
      type: "Training",
      powerConsumptionKw: 120,
      status: "Running",
      urgency: "Low",
      location: "London"
    });
  }

  getJobs(): ComputeJob[] {
    return this.jobs;
  }

  // Helper to update job status (e.g., when Agent pauses it)
  updateJobStatus(jobId: string, status: JobStatus) {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = status;
    }
  }
  
  // Helper to migrate job (e.g. to Iceland)
  migrateJob(jobId: string, location: "London" | "Iceland") {
      const job = this.jobs.find(j => j.id === jobId);
      if (job) {
          job.location = location;
          job.status = "Migrated";
      }
  }
}
