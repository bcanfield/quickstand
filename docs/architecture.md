# Architecture Guide

This document outlines the architectural decisions, patterns, and design principles that guide the development of the Quickstand CLI tool, which helps developers create status updates by managing git logs across multiple repositories and leveraging AI for content generation.

## High-Level Architecture

Quickstand follows a modular architecture with clear separation of concerns:

```
quickstand
├── packages
│   ├── cli         # Command-line interface and user interaction
│   ├── core        # Core business logic, git integration, and AI services
│   └── tsconfig    # Shared TypeScript configuration
```

## Component Architecture

```
┌─────────────────┐     ┌─────────────────────────────────────┐
│                 │     │                                     │
│   CLI Package   │     │           Core Package              │
│                 │     │                                     │
│  ┌───────────┐  │     │  ┌───────────┐     ┌─────────────┐  │
│  │           │  │     │  │           │     │             │  │
│  │  Commands ├──┼─────┼─►│  Services ├─────►  Models     │  │
│  │           │  │     │  │           │     │             │  │
│  └───────────┘  │     │  └───────────┘     └─────────────┘  │
│                 │     │        │                  ▲         │
│  ┌───────────┐  │     │        │                  │         │
│  │           │  │     │        ▼                  │         │
│  │   UI      │  │     │  ┌───────────┐     ┌─────────────┐  │
│  │ Rendering │  │     │  │           │     │             │  │
│  │           │  │     │  │ External  │     │ Repository  │  │
│  └───────────┘  │     │  │ Adapters  │     │ Layer       │  │
│                 │     │  │           │     │             │  │
└─────────────────┘     │  └───────────┘     └─────────────┘  │
                        │                                     │
                        └─────────────────────────────────────┘
```

## Core Architectural Principles

### 1. Command-Query Responsibility Segregation (CQRS)

- **Commands**: Operations that change state (create standup, add repository)
- **Queries**: Operations that return data (list standups, get repository information)

This separation makes the codebase easier to understand and extend.

### 2. Dependency Injection

Use dependency injection to:
- Increase testability
- Reduce coupling between components
- Make dependencies explicit

```typescript
// Example of dependency injection in a service
class StandupService {
  constructor(
    private readonly gitService: GitService,
    private readonly configManager: ConfigManager,
    private readonly storageService: StorageService
  ) {}
  
  async createStandup(options: StandupOptions): Promise<Standup> {
    const repos = await this.configManager.getRepositories();
    const gitLogs = await Promise.all(
      repos.map(repo => this.gitService.fetchLogs(repo.path, options.since))
    );
    
    const standup = new Standup({
      date: new Date(),
      items: this.processGitLogs(gitLogs, repos),
      // other properties
    });
    
    await this.storageService.saveStandup(standup);
    return standup;
  }
}
```

### 3. Interface-Driven Development

- Define interfaces before implementations
- Use interfaces to define contracts between components
- Allows for easier swapping of implementations (e.g., for testing)

## Data Flow Architecture

The data flow in Quickstand follows this pattern:

1. **User Input** → CLI commands process user input and options
2. **Command Handling** → Commands delegate to core services
3. **Data Collection** → Services gather data (git logs, configuration)
4. **Data Processing** → Raw data is transformed into domain models
5. **Persistence** → Processed data is stored
6. **Presentation** → Results are formatted and displayed to the user

## Key Subsystems

### Git Integration Subsystem

Responsible for interacting with git repositories:

```typescript
interface GitService {
  fetchLogs(repoPath: string, since: Date): Promise<GitLogEntry[]>;
  getCurrentBranch(repoPath: string): Promise<string>;
  getRepoInfo(repoPath: string): Promise<RepoInfo>;
}
```

Implementation uses Node.js child processes to execute git commands and parse the results.

### Standup Management Subsystem

Handles the creation, storage, and retrieval of standup data:

```typescript
interface StandupManager {
  createStandup(options: StandupOptions): Promise<Standup>;
  getStandup(id: string): Promise<Standup | null>;
  listStandups(filters?: StandupFilters): Promise<StandupSummary[]>;
  addNoteToStandup(id: string, note: string): Promise<Standup>;
}
```

### AI Integration Subsystem

Manages interaction with AI services for generating status updates:

```typescript
interface AIService {
  generateStatusUpdate(standup: Standup, options: AIOptions): Promise<string>;
  summarizeCommits(commits: GitCommit[]): Promise<string>;
  categorizeCommits(commits: GitCommit[]): Promise<CategorizedCommits>;
}
```

### Configuration Management Subsystem

Handles user configuration for the CLI tool:

```typescript
interface ConfigManager {
  getRepositories(): Promise<Repository[]>;
  addRepository(repoPath: string, options?: RepoOptions): Promise<Repository>;
  removeRepository(repoPath: string): Promise<void>;
  getSettings(): Promise<Settings>;
  updateSettings(settings: Partial<Settings>): Promise<Settings>;
}
```

## Data Storage

Quickstand stores data in the following locations:

1. **Configuration**: Stored in a JSON file in the user's config directory (e.g., `~/.config/quickstand/config.json`)
2. **Standup Data**: Stored in a structured format (JSON) in a data directory (e.g., `~/.config/quickstand/standups/`)

This approach allows for:
- Easy backup and version control of configuration
- Portability across different machines
- Clear separation between configuration and data

## Error Handling Strategy

Quickstand uses a structured approach to error handling:

1. **Domain-Specific Errors**: Custom error classes for different types of failures
   ```typescript
   export class GitOperationError extends Error {
     constructor(message: string, public readonly repoPath: string) {
       super(`Git operation failed: ${message} (in repository: ${repoPath})`);
       this.name = 'GitOperationError';
     }
   }
   ```

2. **CLI Error Presentation**: User-friendly error messages in the command-line interface
   ```typescript
   try {
     await command.execute();
   } catch (error) {
     if (error instanceof GitOperationError) {
       console.error(chalk.red(`Error: ${error.message}`));
       console.log(chalk.yellow(`\nTry checking if the repository exists and has proper permissions.`));
       process.exit(1);
     }
     // Other error types
   }
   ```

## Testing Architecture

The testing strategy is divided into several levels:

1. **Unit Tests**: Test individual components in isolation
   - Services
   - Models
   - Utility functions

2. **Integration Tests**: Test interactions between components
   - Service orchestration
   - Data persistence

3. **Command Tests**: Test CLI commands
   - Test with mocked services
   - Verify correct handling of arguments and options
   - Check error scenarios

4. **End-to-End Tests**: Test complete workflows
   - Test with actual git repositories
   - Verify data flow from input to output

## AI Integration Architecture

The AI integration follows these principles:

1. **Abstraction**: AI service hides implementation details of provider
2. **Templating**: Uses prompt templates for consistent AI interactions
3. **Type Safety**: Structured responses with validation
4. **Fallbacks**: Graceful degradation when AI services are unavailable

```typescript
class OpenAIService implements AIService {
  constructor(
    private readonly apiKey: string,
    private readonly promptTemplates: PromptTemplateManager,
    private readonly responseValidator: ResponseValidator
  ) {}
  
  async generateStatusUpdate(standup: Standup, options: AIOptions): Promise<string> {
    const prompt = this.promptTemplates.getStatusUpdatePrompt(standup, options);
    
    try {
      const response = await this.callOpenAI(prompt);
      const validated = this.responseValidator.validate(response);
      return validated.statusUpdate;
    } catch (error) {
      // Fallback to template-based generation
      return this.generateBasicStatusUpdate(standup);
    }
  }
  
  // Other methods
}
```

## Configuration Management

- Environment variables for runtime configuration
- User configuration stored in a standard location
- Configuration schema validation

## Future Considerations

As the project evolves, consider:

1. **Plugin System**: Allow for custom commands, data sources, and output formats
2. **Team Integration**: Support for sharing standups within a team
3. **Integration with Issue Trackers**: Automatically link commits to issues
4. **Multiple AI Providers**: Support different AI providers with a common interface

## Architectural Decision Records (ADRs)

Significant architectural decisions should be documented as ADRs in the `/docs/adr` directory, following this template:

```markdown
# ADR [number]: [Title]

## Context
[Describe the context and problem statement]

## Decision
[Describe the decision that was made]

## Status
[Proposed/Accepted/Deprecated/Superseded]

## Consequences
[Describe the resulting context after applying the decision]
```

Example ADRs for this project might include:
- ADR 1: Choice of CLI Framework
- ADR 2: Git Integration Strategy
- ADR 3: Storage Format for Standup Data
- ADR 4: AI Provider Selection

By following these architectural principles, we ensure that Quickstand remains maintainable, testable, and scalable as it evolves. 