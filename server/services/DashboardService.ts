import type { GraphRepository } from "../repositories/index.js";
import type { ActivityEvent, OrgStats } from "../dto/index.js";

/** Dashboard surface: aggregate stats + the recent activity feed. */
export class DashboardService {
  constructor(private readonly repo: GraphRepository) {}

  getStats(): Promise<OrgStats> {
    return this.repo.getStats();
  }

  getActivity(): Promise<ActivityEvent[]> {
    return this.repo.getActivity();
  }

  /** Convenience bundle for a single dashboard API call. */
  async getOverview(): Promise<{ stats: OrgStats; activity: ActivityEvent[] }> {
    const [stats, activity] = await Promise.all([
      this.repo.getStats(),
      this.repo.getActivity(),
    ]);
    return { stats, activity };
  }
}