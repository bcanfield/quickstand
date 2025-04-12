# Getting Started with Quickstand

This guide will help you set up your development environment and understand the workflow for contributing to the Quickstand CLI tool, designed to help developers create status updates by managing git logs across multiple repositories.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (Latest LTS version) - [Download](https://nodejs.org/)
- **pnpm** (Latest version) - [Installation Guide](https://pnpm.io/installation)
- **Git** - [Download](https://git-scm.com/downloads)

## Project Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/quickstand.git
   cd quickstand
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Build the project**

   ```bash
   pnpm build
   ```

4. **Link the CLI for local development**

   ```bash
   pnpm cli link
   ```

## CLI Usage

Once installed, you can use the Quickstand CLI to manage your standups:

```bash
# Initialize quickstand configuration
quickstand init

# Add repositories to track
quickstand repo add /path/to/repo1 /path/to/repo2

# Create a new standup entry
quickstand standup create

# List recent standups
quickstand standup list

# Generate a status update using AI
quickstand update generate --for today
```

## Development Workflow

### Running Development Mode

To start the development server with watch mode:

```bash
pnpm dev
```

This will automatically rebuild packages when you make changes to the source code.

### Testing Your CLI Commands

To test your CLI commands during development:

```bash
# Run a specific command
pnpm cli -- standup create

# With arguments
pnpm cli -- repo add /path/to/repo
```

### Automated Testing

Run the tests to ensure everything is working correctly:

```bash
pnpm test
```

To run tests with coverage reporting:

```bash
pnpm test:coverage
```

### Code Quality

Check your code for linting issues:

```bash
pnpm lint
```

Fix linting issues automatically:

```bash
pnpm lint:fix
```

Format your code:

```bash
pnpm format
```

Check type correctness:

```bash
pnpm type-check
```

## Project Structure

Quickstand is a monorepo with the following structure:

- **`/packages/cli`**: The command-line interface for Quickstand
  - Contains command definitions, user interaction logic, and CLI entry points
- **`/packages/core`**: Core functionality and business logic
  - Contains git integration, standup data models, and AI integration services
- **`/packages/tsconfig`**: Shared TypeScript configuration

### Key Files and Directories

- `/packages/cli/src/commands/`: Contains all CLI command implementations
- `/packages/cli/src/index.ts`: Main CLI entry point
- `/packages/core/src/services/`: Core services like GitService, StandupService, AIService
- `/packages/core/src/models/`: Data models for git logs, standups, etc.
- `/packages/core/src/utils/`: Utility functions for common operations

## Key Concepts

### Repositories

Quickstand tracks git activity across multiple repositories. A repository configuration includes:
- Path to the git repository
- Name to display in status updates
- Branch to track (default: current branch)

### Standups

A standup represents a collection of git activity and notes for a specific period. It includes:
- Date
- Git commits grouped by repository
- Manual notes added by the user
- Tags or categories

### Status Updates

Status updates are generated reports based on standup data. They can be:
- Generated automatically using AI
- Customized using templates
- Exported in various formats (text, markdown, etc.)

## Contributing Features

When adding a new feature to Quickstand, follow these steps:

1. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Add CLI Command** (if applicable)

   Create a new command in `/packages/cli/src/commands/`:

   ```typescript
   // Example: adding a new command to export standups
   import { Command } from 'commander';
   import { ExportService } from '@quickstand/core';

   export function createExportCommand(program: Command): void {
     program
       .command('export')
       .description('Export standup data to various formats')
       .option('-f, --format <format>', 'Export format (markdown, text, json)', 'markdown')
       .option('-o, --output <file>', 'Output file path')
       .action(async (options) => {
         // Implementation
       });
   }
   ```

3. **Implement Core Service** (if applicable)

   Add a new service in `/packages/core/src/services/`:

   ```typescript
   // Example: adding a service to handle exports
   export class ExportService {
     async exportStandup(standup: Standup, format: string, outputPath?: string): Promise<void> {
       // Implementation
     }
   }
   ```

4. **Add Tests**

   Add tests for both CLI and core functionality:

   ```typescript
   // Example: testing the export service
   describe('ExportService', () => {
     it('should export standup data to markdown format', async () => {
       // Test implementation
     });
   });
   ```

5. **Create a changeset**

   If your changes should trigger a version update, create a changeset:

   ```bash
   pnpm changeset
   ```

   Follow the prompts to describe your changes.

6. **Push your branch and create a pull request**

   ```bash
   git push -u origin feature/your-feature-name
   ```

## AI Integration Guidelines

When working with the AI integration for generating status updates:

1. **API Integration**: The project uses a template-based approach for calling AI APIs
2. **Prompt Engineering**: Follow established patterns in the `AIService` for creating effective prompts
3. **Output Parsing**: Use typed responses to ensure consistent output structure
4. **Data Privacy**: Be mindful of sensitive information in git commits when sending to external APIs

## Documentation

- Review the [Project Guidelines](./project-guidelines.md) for an overview of our development standards
- Check the [Code Style Guide](./code-style-guide.md) for specific coding conventions
- Read the [Architecture Guide](./architecture.md) for understanding the system design
- Read the [CONTRIBUTING.md](../CONTRIBUTING.md) file for contribution guidelines

## Getting Help

If you encounter any issues or have questions:

- Check existing GitHub issues
- Create a new issue if needed
- Reach out to the project maintainers

## For AI Agents

When implementing features, AI agents should:

1. First understand the existing command structure and service patterns
2. Follow the established code style and architecture
3. Implement both CLI commands and corresponding core services
4. Write comprehensive tests for all new functionality
5. Ensure error handling is properly implemented
6. Update documentation to reflect new features

Welcome to the Quickstand project! We're excited to have you contribute. 