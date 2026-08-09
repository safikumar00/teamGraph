import type { Record as Neo4jRecord } from "neo4j-driver";
import type { InsightCard } from "../dto";

/**
 * Composes raw insight-query records into the public `InsightCard` DTOs.
 *
 * This is the only place insight *business logic* lives. The repository runs
 * the insight queries (data access) and hands the records here; the service
 * layer merely orchestrates. Adding a new insight = add a query + a composer
 * branch below — nothing else changes.
 */
export interface InsightRecords {
  mostConnected: Neo4jRecord[];
  mostMentor: Neo4jRecord[];
  topTechnology: Neo4jRecord[];
  rareSkills: Neo4jRecord[];
  riskyProjects: Neo4jRecord[];
  mostCollaborativeTeam: Neo4jRecord[];
  knowledgeSpread: Neo4jRecord[];
}

function first(records: Neo4jRecord[]): Neo4jRecord | null {
  return records.length > 0 ? records[0]! : null;
}

function num(record: Neo4jRecord | null, key: string, fallback = 0): number {
  if (!record) return fallback;
  const value = record.get(key);
  if (value === null || value === undefined) return fallback;
  if (typeof value === "number") return value;
  if (typeof value === "object" && "toNumber" in value && typeof (value as any).toNumber === "function") {
    return (value as any).toNumber();
  }
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
}

function str(record: Neo4jRecord | null, key: string, fallback = ""): string {
  if (!record) return fallback;
  const value = record.get(key);
  return typeof value === "string" ? value : fallback;
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function composeInsights(raw: InsightRecords): InsightCard[] {
  const cards: InsightCard[] = [];

  const connected = first(raw.mostConnected);
  if (connected) {
    const degree = num(connected, "degree");
    cards.push({
      id: "most-connected",
      title: "Most Connected Employee",
      question: "Who sits at the centre of the organizational graph?",
      headline: str(connected, "name"),
      detail: `${str(connected, "name")} — ${str(connected, "role")} — holds ${degree} direct relationships across the graph.`,
      metric: `${degree} edges`,
      metricLabel: "direct relationships",
      score: clamp(degree * 4),
      severity: "info",
      entities: [{ label: str(connected, "name"), type: "employee", id: str(connected, "id") }],
    });
  }

  const mentor = first(raw.mostMentor);
  if (mentor) {
    const mentees = num(mentor, "mentees");
    cards.push({
      id: "top-mentor",
      title: "Most Experienced Mentor",
      question: "Who carries the most mentoring responsibility?",
      headline: str(mentor, "name"),
      detail: `${str(mentor, "name")} mentors ${mentees} people with ${num(mentor, "experienceYears")} years of experience.`,
      metric: `${mentees} mentees`,
      metricLabel: "active mentorships",
      score: clamp(mentees * 22),
      severity: "positive",
      entities: [{ label: str(mentor, "name"), type: "employee", id: str(mentor, "id") }],
    });
  }

  const tech = first(raw.topTechnology);
  if (tech) {
    const adoption = num(tech, "adoption");
    cards.push({
      id: "top-technology",
      title: "Most Used Technology",
      question: "Which technology has the highest adoption across delivery?",
      headline: str(tech, "name"),
      detail: `${str(tech, "name")} is used across ${num(tech, "projects")} projects at ${adoption}% adoption.`,
      metric: `${adoption}% adoption`,
      metricLabel: "across the portfolio",
      score: clamp(adoption),
      severity: "info",
      entities: [{ label: str(tech, "name"), type: "technology", id: str(tech, "id") }],
    });
  }

  const rarest = first(raw.rareSkills);
  if (rarest) {
    const holders = num(rarest, "holders");
    cards.push({
      id: "rare-skill",
      title: "Rarest Skill",
      question: "Where is organisational knowledge most concentrated?",
      headline: str(rarest, "name"),
      detail: `${str(rarest, "name")} (${str(rarest, "category")}) is held by only ${holders} people — a single-point-of-knowledge risk.`,
      metric: `${holders} holders`,
      metricLabel: "knowledge concentration",
      score: clamp((10 - holders) * 10),
      severity: holders <= 2 ? "critical" : "warning",
      entities: [{ label: str(rarest, "name"), type: "skill", id: str(rarest, "id") }],
    });
  }

  const risky = raw.riskyProjects;
  if (risky.length > 0) {
    const top = risky[0]!;
    cards.push({
      id: "risky-projects",
      title: "Projects at Risk",
      question: "Which projects need attention right now?",
      headline: `${risky.length} flagged`,
      detail: `${str(top, "name")} is ${str(top, "status")} with ${str(top, "risk")} risk and ${num(top, "members")} members.`,
      metric: `${risky.length} projects`,
      metricLabel: "flagged for review",
      score: clamp(risky.length * 18),
      severity: "critical",
      entities: [{ label: str(top, "name"), type: "project", id: str(top, "id") }],
    });
  }

  const collab = first(raw.mostCollaborativeTeam);
  if (collab) {
    const partners = num(collab, "partners");
    cards.push({
      id: "most-collaborative",
      title: "Most Collaborative Team",
      question: "Which team has the widest collaboration reach?",
      headline: str(collab, "name"),
      detail: `${str(collab, "name")} collaborates with ${partners} other teams, focused on ${str(collab, "focus")}.`,
      metric: `${partners} partner teams`,
      metricLabel: "cross-team reach",
      score: clamp(partners * 14),
      severity: "positive",
      entities: [{ label: str(collab, "name"), type: "team", id: str(collab, "id") }],
    });
  }

  const spread = first(raw.knowledgeSpread);
  if (spread) {
    const total = num(spread, "total");
    const covered = num(spread, "wellCovered");
    const pct = total > 0 ? Math.round((covered / total) * 100) : 0;
    cards.push({
      id: "knowledge-spread",
      title: "Knowledge Spread",
      question: "How widely is skill knowledge distributed?",
      headline: `${pct}% well covered`,
      detail: `${covered} of ${total} skills are held by 5+ people; the remainder represent concentration risk.`,
      metric: `${pct}%`,
      metricLabel: "skills well distributed",
      score: clamp(pct),
      severity: pct >= 70 ? "positive" : "warning",
      entities: [],
    });
  }

  return cards;
}