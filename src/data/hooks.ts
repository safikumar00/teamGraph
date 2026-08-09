import { useQuery } from "@tanstack/react-query";
import { repository, type EmployeeFilters, type GraphOptions, type ProjectFilters } from "./repository";
import type { EntityType } from "./types";

/**
 * All UI reads go through these hooks. They know nothing about the mock
 * dataset — only about the repository contract.
 */
const key = (...parts: unknown[]) => ["teamgraph", ...parts];

export const useStats = () => useQuery({ queryKey: key("stats"), queryFn: () => repository.getStats() });

export const useActivity = () =>
  useQuery({ queryKey: key("activity"), queryFn: () => repository.getActivity() });

export const useEmployees = (filters: EmployeeFilters = {}) =>
  useQuery({ queryKey: key("employees", filters), queryFn: () => repository.listEmployees(filters) });

export const useEmployee = (id: string) =>
  useQuery({ queryKey: key("employee", id), queryFn: () => repository.getEmployee(id) });

export const useTeams = () => useQuery({ queryKey: key("teams"), queryFn: () => repository.listTeams() });

export const useTeam = (id: string) =>
  useQuery({ queryKey: key("team", id), queryFn: () => repository.getTeam(id) });

export const useProjects = (filters: ProjectFilters = {}) =>
  useQuery({ queryKey: key("projects", filters), queryFn: () => repository.listProjects(filters) });

export const useProject = (id: string) =>
  useQuery({ queryKey: key("project", id), queryFn: () => repository.getProject(id) });

export const useSkills = (query?: string) =>
  useQuery({ queryKey: key("skills", query), queryFn: () => repository.listSkills(query) });

export const useSkill = (id: string) =>
  useQuery({ queryKey: key("skill", id), queryFn: () => repository.getSkill(id) });

export const useTechnologies = (query?: string) =>
  useQuery({ queryKey: key("technologies", query), queryFn: () => repository.listTechnologies(query) });

export const useTechnology = (id: string) =>
  useQuery({ queryKey: key("technology", id), queryFn: () => repository.getTechnology(id) });

export const useClients = (query?: string) =>
  useQuery({ queryKey: key("clients", query), queryFn: () => repository.listClients(query) });

export const useClient = (id: string) =>
  useQuery({ queryKey: key("client", id), queryFn: () => repository.getClient(id) });

export const useCertifications = () =>
  useQuery({ queryKey: key("certifications"), queryFn: () => repository.listCertifications() });

export const useRelationships = (ref: { type: EntityType; id: string }) =>
  useQuery({ queryKey: key("relationships", ref), queryFn: () => repository.getRelationships(ref) });

export const useGraph = (options: GraphOptions = {}) =>
  useQuery({ queryKey: key("graph", options), queryFn: () => repository.getGraph(options) });

export const useInsights = () =>
  useQuery({ queryKey: key("insights"), queryFn: () => repository.getInsights() });

export const useSearch = (query: string) =>
  useQuery({ queryKey: key("search", query), queryFn: () => repository.search(query) });
