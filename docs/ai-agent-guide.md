# AI Agent Development Guide

This document provides specialized instructions for AI agents contributing to the Quickstand project - a CLI tool that helps developers track git activities across multiple repositories and generate status updates using AI.

## Understanding the Project

### Purpose and Scope

Quickstand serves these primary functions:
1. Fetch and organize git logs across multiple repositories
2. Manage "standup" entries (collections of activity over time periods)
3. Generate human-readable status updates using AI

This is a CLI tool only (no frontend/UI components).

### Core Concepts

- **Repository Tracking**: Managing git repositories and collecting commit data
- **Standup Management**: Creating, storing, and retrieving developer activity records
- **AI Integration**: Using AI models to generate meaningful status updates

## Repository Structure

```
quickstand/
├── packages/
│   ├── cli/               # Command-line interface
│   │   ├── src/
│   │   │   ├── commands/  # Command implementations
│   │   │   ├── index.ts   # CLI entry point
│   │   │   └── types/     # CLI-specific type definitions
│   ├── core/              # Core functionality
│   │   ├── src/
│   │   │   ├── services/  # Business logic services
│   │   │   ├── models/    # Data models
│   │   │   ├── utils/     # Utility functions
│   │   │   └── types/     # Type definitions
│   └── tsconfig/          # Shared TypeScript configuration
└── docs/                  # Documentation
```

## Implementation Guidelines for AI Agents

### Development Workflow

1. **Analyze Request**: Fully understand the feature or bugfix needed
2. **Explore Codebase**: Identify relevant components and patterns
3. **Follow Existing Patterns**: Maintain consistency with established code style
4. **Implement Changes**: Develop the feature following project guidelines
5. **Write Tests**: Create comprehensive tests for the implementation
6. **Document Changes**: Update documentation if necessary

### Pattern Recognition

When adding new functionality, first identify the appropriate patterns from existing code. Key patterns include:

#### 1. Command Structure (CLI)

```typescript
// Example: packages/cli/src/commands/standup-create.ts
import { Command } from 'commander';
import { StandupService } from '@quickstand/core';

export function createStandupCommand(program: Command): void {
  program
    .command('standup')
    .description('Manage standups')
    .addCommand(createStandupCreateCommand());
}

function createStandupCreateCommand(): Command {
  const command = new Command('create');
  command
    .description('Create a new standup entry')
    .option('-d, --date <date>', 'Standup date (default: today)')
    .option('-r, --repos <repos...>', 'Repositories to include')
    .action(async (options) => {
      // Implementation
    });
  
  return command;
}
```

#### 2. Service Implementation (Core)

```typescript
// Example: packages/core/src/services/standup-service.ts
import { GitService } from './git-service';
import { StorageService } from './storage-service';
import { Standup, Repository } from '../models';

export class StandupService {
  constructor(
    private readonly gitService: GitService,
    private readonly storageService: StorageService
  ) {}
  
  async createStandup(options: StandupOptions): Promise<Standup> {
    // Implementation
  }
  
  async getStandup(id: string): Promise<Standup | null> {
    // Implementation
  }
  
  // Other methods
}
```

#### 3. Domain Model Pattern

```typescript
// Example: packages/core/src/models/standup.ts
export class Standup {
  id: string;
  date: Date;
  repositories: Repository[];
  items: StandupItem[];
  
  constructor(data: Partial<Standup>) {
    this.id = data.id || generateId();
    this.date = data.date || new Date();
    this.repositories = data.repositories || [];
    this.items = data.items || [];
  }
  
  // Methods
  
  addItem(item: StandupItem): void {
    this.items.push(item);
  }
  
  getSummary(): StandupSummary {
    // Implementation
  }
}
```

### Tips for AI Development

1. **Command Implementation**:
   - Each CLI command should be focused on a single action
   - Use commander.js patterns consistently
   - Delegate business logic to core services

2. **Service Development**:
   - Implement interfaces before concrete classes
   - Follow dependency injection pattern
   - Keep services focused on specific domain concerns
   - Use meaningful, descriptive method and parameter names

3. **Git Integration**:
   - Use Node.js child_process to execute git commands
   - Properly handle error scenarios
   - Parse git output consistently
   - Consider performance for large repositories

4. **AI Integration**:
   - Abstract provider-specific details
   - Build robust prompt templates
   - Include fallback mechanisms when AI is unavailable
   - Validate and sanitize AI outputs

5. **Data Persistence**:
   - Store data in user-friendly formats (JSON)
   - Include data versioning/migration capability
   - Consider filesystem performance
   - Handle concurrency issues

## Testing Guidelines for AI Agents

When writing tests, follow these patterns:

### Unit Testing Services

```typescript
// Example: packages/core/src/services/git-service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { GitService } from './git-service';
import { execCommand } from '../utils/exec';

// Mock dependencies
vi.mock('../utils/exec', () => ({
  execCommand: vi.fn()
}));

describe('GitService', () => {
  // Setup
  let gitService: GitService;
  
  beforeEach(() => {
    gitService = new GitService();
    vi.resetAllMocks();
  });
  
  it('should fetch git logs from repository', async () => {
    // Arrange
    const mockOutput = '123abc|John Doe|2023-01-01|Fix bug';
    (execCommand as jest.Mock).mockResolvedValue(mockOutput);
    
    // Act
    const logs = await gitService.fetchLogs('/path/to/repo', new Date('2023-01-01'));
    
    // Assert
    expect(execCommand).toHaveBeenCalledWith(expect.stringContaining('git -C /path/to/repo log'));
    expect(logs).toHaveLength(1);
    expect(logs[0].hash).toBe('123abc');
  });
});
```

### Testing CLI Commands

```typescript
// Example: packages/cli/src/commands/standup-create.test.ts
import { describe, it, expect, vi } from 'vitest';
import { Command } from 'commander';
import { createStandupCreateCommand } from './standup-create';
import { StandupService } from '@quickstand/core';

// Mock dependencies
vi.mock('@quickstand/core', () => ({
  StandupService: vi.fn(() => ({
    createStandup: vi.fn().mockResolvedValue({
      id: 'mock-id',
      date: new Date('2023-01-01')
    })
  }))
}));

describe('standup create command', () => {
  it('should create a standup with default options', async () => {
    // Arrange
    const command = createStandupCreateCommand();
    const mockAction = command.action as jest.Mock;
    
    // Act
    await mockAction({});
    
    // Assert
    const standupService = new StandupService();
    expect(standupService.createStandup).toHaveBeenCalledWith(expect.objectContaining({
      date: expect.any(Date)
    }));
  });
});
```

## Common Pitfalls to Avoid

1. **Tight Coupling**: Avoid direct dependencies between packages; use interfaces
2. **Magic Strings/Numbers**: Define constants for values used multiple times
3. **Inconsistent Error Handling**: Follow the established error handling pattern
4. **Incomplete Tests**: Ensure tests cover happy paths and error cases
5. **Overly Complex Commands**: Keep CLI commands simple and delegate to services
6. **Ignoring Filesystem Performance**: Be mindful of I/O operations in large repositories
7. **Incomplete Type Definitions**: Ensure all interfaces and types are properly defined
8. **Inconsistent CLI Output Format**: Follow established output patterns

## Step-by-Step Implementation Example

To demonstrate an effective implementation process, here's how to add a new feature:

### Example: Adding a Command to Export Standups as Markdown

1. **Define Interface in Core**:
   ```typescript
   // packages/core/src/services/export-service.ts
   export interface ExportService {
     exportStandup(standup: Standup, format: string, outputPath?: string): Promise<string>;
   }
   
   // Implementation
   export class MarkdownExportService implements ExportService {
     async exportStandup(standup: Standup, format: string, outputPath?: string): Promise<string> {
       // Generate markdown content
       const content = this.generateMarkdown(standup);
       
       // Write to file if outputPath is provided
       if (outputPath) {
         await fs.promises.writeFile(outputPath, content, 'utf-8');
       }
       
       return content;
     }
     
     private generateMarkdown(standup: Standup): string {
       // Implementation
     }
   }
   ```

2. **Add CLI Command**:
   ```typescript
   // packages/cli/src/commands/standup-export.ts
   import { Command } from 'commander';
   import { StandupService, MarkdownExportService } from '@quickstand/core';
   
   export function createStandupExportCommand(): Command {
     const command = new Command('export');
     command
       .description('Export standup to various formats')
       .option('-i, --id <id>', 'Standup ID to export')
       .option('-f, --format <format>', 'Export format (markdown, text, json)', 'markdown')
       .option('-o, --output <path>', 'Output file path')
       .action(async (options) => {
         try {
           const standupService = new StandupService();
           const exportService = new MarkdownExportService();
           
           const standup = await standupService.getStandup(options.id);
           if (!standup) {
             console.error(`Standup with ID ${options.id} not found`);
             process.exit(1);
           }
           
           const result = await exportService.exportStandup(
             standup, 
             options.format, 
             options.output
           );
           
           if (!options.output) {
             console.log(result);
           } else {
             console.log(`Standup exported to ${options.output}`);
           }
         } catch (error) {
           // Error handling
         }
       });
     
     return command;
   }
   ```

3. **Register Command**:
   ```typescript
   // packages/cli/src/commands/standup.ts
   import { Command } from 'commander';
   import { createStandupCreateCommand } from './standup-create';
   import { createStandupListCommand } from './standup-list';
   import { createStandupExportCommand } from './standup-export';
   
   export function createStandupCommand(program: Command): void {
     const command = new Command('standup');
     command
       .description('Manage standups');
     
     command.addCommand(createStandupCreateCommand());
     command.addCommand(createStandupListCommand());
     command.addCommand(createStandupExportCommand()); // Add new command
     
     program.addCommand(command);
   }
   ```

4. **Write Tests**:
   ```typescript
   // packages/core/src/services/markdown-export-service.test.ts
   import { describe, it, expect, vi } from 'vitest';
   import { MarkdownExportService } from './export-service';
   import { Standup } from '../models';
   
   describe('MarkdownExportService', () => {
     it('should generate markdown from standup data', async () => {
       // Arrange
       const service = new MarkdownExportService();
       const standup = new Standup({
         id: 'test-id',
         date: new Date('2023-01-01'),
         items: [/* test data */]
       });
       
       // Act
       const result = await service.exportStandup(standup, 'markdown');
       
       // Assert
       expect(result).toContain('# Standup Summary');
       expect(result).toContain('2023-01-01');
     });
   });
   ```

## Final Notes for AI Agents

1. **Be Consistent**: Follow established patterns and code style
2. **Be Thorough**: Implement comprehensive error handling and tests
3. **Be Clear**: Use descriptive names and add comments for complex logic
4. **Be Modular**: Keep components focused and maintain separation of concerns
5. **Be Documented**: Update documentation to reflect new features

Following these guidelines will ensure that AI-generated contributions maintain the quality and consistency of the codebase. 