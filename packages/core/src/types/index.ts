/**
 * Input for creating a standup
 */
export interface StandupInput {
  /** Name of the standup */
  name: string;
  /** Optional description of the standup */
  description?: string;
}

/**
 * Standup model
 */
export interface Standup extends StandupInput {
  /** Unique identifier */
  id: string;
  /** Array of repository IDs associated with this standup */
  repositories: string[];
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Input for adding a repository
 */
export interface RepositoryInput {
  /** Path to the git repository */
  path: string;
  /** Optional custom name for the repository */
  name?: string;
  /** Optional ID of the standup to add the repository to */
  standupId?: string;
}

/**
 * Repository model
 */
export interface Repository {
  /** Unique identifier */
  id: string;
  /** Path to the git repository */
  path: string;
  /** Repository name */
  name: string;
  /** Whether the repository is active */
  active: boolean;
}

export interface ConfigData {
  standups: Record<string, Standup>;
  repositories: Record<string, Repository>;
  defaultStandupId?: string;
}

export interface StandupOptions {
  name: string;
  description?: string;
}

export interface RepositoryOptions {
  path: string;
  name?: string;
  standupId?: string;
} 