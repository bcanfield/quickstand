/**
 * Base error class for Quickstand application errors
 */
export class QuickstandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuickstandError';
  }
}

/**
 * Error thrown when a repository is not found
 */
export class RepositoryNotFoundError extends QuickstandError {
  constructor(id: string) {
    super(`Repository with ID ${id} not found`);
    this.name = 'RepositoryNotFoundError';
  }
}

/**
 * Error thrown when a repository path is not valid
 */
export class InvalidRepositoryError extends QuickstandError {
  constructor(path: string) {
    super(`Invalid git repository at path: ${path}`);
    this.name = 'InvalidRepositoryError';
  }
}

/**
 * Error thrown when a standup is not found
 */
export class StandupNotFoundError extends QuickstandError {
  constructor(id: string) {
    super(`Standup with ID ${id} not found`);
    this.name = 'StandupNotFoundError';
  }
}

/**
 * Error thrown when a repository already exists
 */
export class RepositoryExistsError extends QuickstandError {
  constructor(path: string) {
    super(`Repository already exists for path: ${path}`);
    this.name = 'RepositoryExistsError';
  }
}

/**
 * Error thrown when a standup already exists
 */
export class StandupExistsError extends QuickstandError {
  constructor(name: string) {
    super(`Standup already exists with name: ${name}`);
    this.name = 'StandupExistsError';
  }
} 