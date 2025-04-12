# Code Style Guide

This document outlines the specific code style guidelines for the Quickstand project, complementing the higher-level principles found in the [Project Guidelines](./project-guidelines.md).

## TypeScript Guidelines

### Type Definitions

- Always use explicit type annotations for function parameters and return types
- Use interfaces for object shapes that will be implemented or extended
- Use type aliases for union types, intersection types, or simple object shapes
- Avoid using `any` type; prefer `unknown` when type is truly unknown
- Use readonly modifiers for immutable properties
- Utilize utility types like `Partial<T>`, `Required<T>`, `Pick<T, K>`, etc.

```typescript
// Good
function processGitLogs(logs: GitLogEntry[]): StandupItem[] {
  // ...
}

// Avoid
function processGitLogs(logs) {
  // ...
}
```

### Nullability

- Use `undefined` rather than `null` in most cases
- Explicitly handle potentially undefined values with nullish coalescing (`??`)

```typescript
// Good
const commitMessage = commit?.message ?? 'No commit message provided';

// Avoid
const commitMessage = commit && commit.message ? commit.message : 'No commit message provided';
```

### Asynchronous Code

- Use async/await over raw promises for better readability
- Properly handle errors in async functions using try/catch
- Avoid nested promises and callback patterns

```typescript
// Good
async function fetchGitLogs(repoPath: string): Promise<GitLogEntry[]> {
  try {
    const output = await execCommand(`git -C ${repoPath} log --since="1 day ago" --pretty=format:"%h|%an|%ad|%s"`);
    return parseGitLogOutput(output);
  } catch (error) {
    logger.error(`Failed to fetch git logs for ${repoPath}`, error);
    throw new GitOperationError(`Failed to fetch git logs for ${repoPath}`);
  }
}

// Avoid
function fetchGitLogs(repoPath: string): Promise<GitLogEntry[]> {
  return execCommand(`git -C ${repoPath} log --since="1 day ago" --pretty=format:"%h|%an|%ad|%s"`)
    .then(output => {
      return parseGitLogOutput(output);
    })
    .catch(error => {
      logger.error(`Failed to fetch git logs for ${repoPath}`, error);
      throw new GitOperationError(`Failed to fetch git logs for ${repoPath}`);
    });
}
```

## CLI-Specific Patterns

### Command Structure

- Use a consistent pattern for defining CLI commands
- Each command should have a clear responsibility
- Implement a common interface for all commands

```typescript
interface Command {
  name: string;
  description: string;
  execute(args: string[]): Promise<void>;
}

class StandupCreateCommand implements Command {
  name = 'create';
  description = 'Create a new standup entry';
  
  async execute(args: string[]): Promise<void> {
    // Implementation
  }
}
```

### User Interaction

- Use a consistent approach for interactive prompts
- Provide clear, concise output messages
- Include both human-readable output and structured data (for scripting)

```typescript
// Good practice for CLI output
import chalk from 'chalk';

function displayStandupSummary(standup: Standup): void {
  console.log(chalk.bold('\nStandup Summary:'));
  console.log(chalk.blue(`Date: ${standup.date.toLocaleDateString()}`));
  console.log(chalk.blue(`Repositories: ${standup.repositories.length}`));
  console.log(chalk.blue(`Total commits: ${standup.totalCommits}`));
  
  standup.items.forEach(item => {
    console.log(chalk.green(`\n${item.repositoryName}:`));
    item.commits.forEach(commit => {
      console.log(`- ${commit.message} (${commit.hash.substring(0, 7)})`);
    });
  });
}
```

## File Organization

### Imports

- Group imports in the following order, with a blank line between groups:
  1. Built-in Node.js modules
  2. External dependencies
  3. Internal modules (using relative paths)
- Sort imports alphabetically within each group

```typescript
// Built-in modules
import { promises as fs } from 'fs';
import path from 'path';

// External dependencies
import chalk from 'chalk';
import { Command } from 'commander';

// Internal modules
import { GitService } from './services/git-service';
import { StandupManager } from './services/standup-manager';
```

### Exports

- Prefer named exports over default exports
- Keep export statements at the end of the file when possible
- If a file has a single main export, consider using export default

## Naming Conventions

- **Variables and Functions**: Use camelCase
- **Classes, Interfaces, and Types**: Use PascalCase
- **Constants**: Use UPPER_SNAKE_CASE for truly constant values
- **Files and Directories**: Use kebab-case for filenames
- **Prefix private/protected methods** with underscore (_)
- **Boolean variables**: Prefix with `is`, `has`, `should`, etc.

```typescript
// Variables and functions
const gitLogs = getGitLogs();

// Classes and interfaces
class StandupService {}
interface GitLogEntry {}

// Constants
const MAX_REPO_LIMIT = 10;

// Boolean variables
const isRepoConfigured = checkRepoConfig();
```

## Comments and Documentation

- Use JSDoc comments for functions, classes, and interfaces
- Include parameter descriptions, return type descriptions, and examples where helpful
- For complex algorithms or logic, include a high-level description

```typescript
/**
 * Processes git log entries and converts them to standup items
 * 
 * @param gitLogs - The raw git log entries from multiple repositories
 * @param options - Optional processing configuration
 * @returns Formatted standup items ready for display or AI processing
 * 
 * @example
 * ```
 * const standupItems = processGitLogs(logs, { groupByRepo: true });
 * ```
 */
function processGitLogs(gitLogs: GitLogEntry[], options?: ProcessOptions): StandupItem[] {
  // ...
}
```

## Error Handling

- Use custom error classes when appropriate
- Provide meaningful error messages
- Avoid swallowing errors without proper handling
- Log errors at appropriate levels
- For CLI tools, ensure errors are displayed in a user-friendly format

```typescript
// Custom error class
class GitOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GitOperationError';
  }
}

// Error handling in CLI context
try {
  await gitService.fetchLogs(repoPath);
} catch (error) {
  if (error instanceof GitOperationError) {
    console.error(chalk.red(`Error accessing git repository: ${error.message}`));
    process.exit(1);
  } else {
    console.error(chalk.red('An unexpected error occurred'));
    console.error(error);
    process.exit(1);
  }
}
```

## Testing Guidelines

- Test files should be named with `.test.ts` suffix and placed next to the source file
- Use descriptive test names that clearly state what is being tested
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies to ensure unit tests are isolated
- For CLI tools, test both the logic and the command-line interface

```typescript
import { describe, it, expect, vi } from 'vitest';
import { StandupService } from './standup-service';
import { GitService } from './git-service';

describe('StandupService', () => {
  it('should create a standup with git logs from multiple repositories', async () => {
    // Arrange
    const mockGitService = {
      fetchLogs: vi.fn().mockResolvedValue([
        { hash: '123abc', author: 'John Doe', date: new Date(), message: 'Fix bug' }
      ])
    } as unknown as GitService;
    
    const standupService = new StandupService(mockGitService);
    
    // Act
    const standup = await standupService.createStandup(['repo1', 'repo2']);
    
    // Assert
    expect(mockGitService.fetchLogs).toHaveBeenCalledTimes(2);
    expect(standup.items.length).toBe(2);
  });
});
```

## Performance Considerations

- Avoid unnecessary re-computation of values
- Be mindful of memory usage, especially with large git repositories
- Cache git logs when appropriate to avoid repeated calls
- Consider using worker threads for intensive operations

By following these style guidelines, we ensure consistency across the codebase and make it easier for team members and AI agents to read, understand, and maintain the code. 