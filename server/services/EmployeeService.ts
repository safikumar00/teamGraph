import type { GraphRepository } from "../repositories";
import type { EmployeeFilters } from "../types";
import type { Employee, Relationship } from "../dto";

/** Employee surface: list, detail, and the employee's graph relationships. */
export class EmployeeService {
  constructor(private readonly repo: GraphRepository) {}

  list(filters: EmployeeFilters = {}): Promise<Employee[]> {
    return this.repo.listEmployees(filters);
  }

  get(id: string): Promise<Employee | null> {
    return this.repo.getEmployee(id);
  }

  relationships(id: string): Promise<Relationship[]> {
    return this.repo.getRelationships({ type: "employee", id });
  }
}