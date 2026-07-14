export type RepositoryNodeKind = "directory" | "file" | "service" | "package";

export type RepositoryNode = {
  id: string;
  path: string;
  kind: RepositoryNodeKind;
  depth: number;
  weight: number;
  language?: string;
};

export type RepositoryDependency = {
  from: string;
  to: string;
  strength: number;
  cyclic?: boolean;
};

export type RepositoryIssue = {
  id: string;
  nodeId: string;
  kind: "dead-file" | "unused-module" | "build-failure" | "test-failure" | "orphan-service";
  severity: number;
};

export type RepositorySnapshot = {
  repository: string;
  nodes: RepositoryNode[];
  dependencies: RepositoryDependency[];
  issues: RepositoryIssue[];
  services: string[];
  commits: number;
  contributors: number;
  branches: string[];
  languages: Record<string, number>;
};

export const previewRepository: RepositorySnapshot = {
  repository: "repository-preview",
  nodes: [
    { id: "client", path: "client", kind: "directory", depth: 1, weight: 0.8, language: "TypeScript" },
    { id: "core", path: "core", kind: "directory", depth: 1, weight: 1, language: "TypeScript" },
    { id: "services", path: "services", kind: "service", depth: 1, weight: 0.9, language: "Node" },
    { id: "data", path: "data", kind: "directory", depth: 1, weight: 0.72, language: "SQL" },
    { id: "automation", path: "automation", kind: "package", depth: 1, weight: 0.66, language: "Python" },
    { id: "docs", path: "docs", kind: "directory", depth: 1, weight: 0.46 },
  ],
  dependencies: [
    { from: "client", to: "core", strength: 0.82 },
    { from: "core", to: "services", strength: 1 },
    { from: "services", to: "data", strength: 0.76 },
    { from: "automation", to: "services", strength: 0.58 },
    { from: "docs", to: "core", strength: 0.32 },
    { from: "services", to: "core", strength: 0.48, cyclic: true },
  ],
  issues: [
    { id: "issue-1", nodeId: "services", kind: "unused-module", severity: 0.72 },
    { id: "issue-2", nodeId: "automation", kind: "orphan-service", severity: 0.56 },
    { id: "issue-3", nodeId: "core", kind: "test-failure", severity: 0.9 },
    { id: "issue-4", nodeId: "data", kind: "dead-file", severity: 0.44 },
  ],
  services: ["gateway", "worker", "indexer", "compiler"],
  commits: 0,
  contributors: 0,
  branches: [],
  languages: {
    TypeScript: 0.64,
    Node: 0.18,
    Python: 0.1,
    SQL: 0.08,
  },
};
