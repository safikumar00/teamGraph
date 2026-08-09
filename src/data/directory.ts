import { useEmployees, useProjects, useSkills, useTeams, useTechnologies, useClients } from "./hooks";
import type { EntityType } from "./types";

/**
 * Lookup dictionaries built from the repository hooks. Components use these to
 * resolve relationship ids to display labels without importing mock data.
 */
export function useDirectory() {
  const employees = useEmployees();
  const teams = useTeams();
  const projects = useProjects();
  const skills = useSkills();
  const technologies = useTechnologies();
  const clients = useClients();

  const isLoading =
    employees.isLoading ||
    teams.isLoading ||
    projects.isLoading ||
    skills.isLoading ||
    technologies.isLoading ||
    clients.isLoading;

  const employee = (id: string) => employees.data?.find((e) => e.id === id);
  const team = (id: string) => teams.data?.find((t) => t.id === id);
  const project = (id: string) => projects.data?.find((p) => p.id === id);
  const skill = (id: string) => skills.data?.find((s) => s.id === id);
  const technology = (id: string) => technologies.data?.find((t) => t.id === id);
  const client = (id: string) => clients.data?.find((c) => c.id === id);

  const labelFor = (type: EntityType, id: string) =>
    ({
      employee: employee(id)?.name,
      team: team(id)?.name,
      project: project(id)?.name,
      skill: skill(id)?.name,
      technology: technology(id)?.name,
      client: client(id)?.name,
      certification: id,
    })[type] ?? id;

  return {
    isLoading,
    employees: employees.data ?? [],
    teams: teams.data ?? [],
    projects: projects.data ?? [],
    skills: skills.data ?? [],
    technologies: technologies.data ?? [],
    clients: clients.data ?? [],
    employee,
    team,
    project,
    skill,
    technology,
    client,
    labelFor,
  };
}

export const entityPath: Record<EntityType, string | null> = {
  employee: "/employees",
  team: "/teams",
  project: "/projects",
  skill: "/skills",
  technology: "/technologies",
  client: "/clients",
  certification: null,
};
