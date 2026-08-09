import {
  Award,
  Boxes,
  Building2,
  Cpu,
  FolderKanban,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import type { EntityType, RelationshipType } from "@/data/types";

export const ENTITY_META: Record<
  EntityType,
  { label: string; plural: string; icon: LucideIcon; color: string; soft: string; text: string }
> = {
  employee: {
    label: "Employee",
    plural: "Employees",
    icon: User,
    color: "var(--entity-employee)",
    soft: "bg-entity-employee/10",
    text: "text-entity-employee",
  },
  team: {
    label: "Team",
    plural: "Teams",
    icon: Boxes,
    color: "var(--entity-team)",
    soft: "bg-entity-team/10",
    text: "text-entity-team",
  },
  project: {
    label: "Project",
    plural: "Projects",
    icon: FolderKanban,
    color: "var(--entity-project)",
    soft: "bg-entity-project/10",
    text: "text-entity-project",
  },
  skill: {
    label: "Skill",
    plural: "Skills",
    icon: Sparkles,
    color: "var(--entity-skill)",
    soft: "bg-entity-skill/10",
    text: "text-entity-skill",
  },
  technology: {
    label: "Technology",
    plural: "Technologies",
    icon: Cpu,
    color: "var(--entity-technology)",
    soft: "bg-entity-technology/10",
    text: "text-entity-technology",
  },
  client: {
    label: "Client",
    plural: "Clients",
    icon: Building2,
    color: "var(--entity-client)",
    soft: "bg-entity-client/10",
    text: "text-entity-client",
  },
  certification: {
    label: "Certification",
    plural: "Certifications",
    icon: Award,
    color: "var(--entity-certification)",
    soft: "bg-entity-certification/10",
    text: "text-entity-certification",
  },
};

export const RELATIONSHIP_LABEL: Record<RelationshipType, string> = {
  WORKS_IN: "works in",
  WORKED_ON: "worked on",
  HAS_SKILL: "has skill",
  USES: "uses",
  MENTORED: "mentored",
  REPORTS_TO: "reports to",
  FOR_CLIENT: "for client",
  CERTIFIED_IN: "certified in",
  COLLABORATES_WITH: "collaborates with",
  DEPENDS_ON: "depends on",
  RELATED_TO: "related to",
};
