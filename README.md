# Quickstand

A modern CLI tool for managing standups and generating status updates from git activity.

## Features

- Fetch git logs across multiple repositories
- Manage standup entries for tracking work
- Generate human-readable status updates using AI
- Modern TypeScript setup
- Fast and efficient with pnpm
- Biome for linting and formatting
- Vitest for testing
- tsup for building

## Installation

```bash
npm install -g quickstand
```

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Interact with CLI. Code changes will be reflected automatically
   ```bash
   pnpm cli -h
   ```

## Scripts

- `pnpm build` - Build the project
- `pnpm dev` - Watch mode for development
- `pnpm test` - Run tests
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome

## AI-Powered Issue Resolution

This repository is integrated with OpenHands AI agent to help resolve issues automatically. You can use this feature in two ways:

1. **Using the 'fix-me' label**:
   - Add the 'fix-me' label to any issue you want the AI to resolve
   - The AI agent will attempt to fix it and create a draft PR

2. **Using `@openhands-agent` mention**:
   - Comment on any issue with `@openhands-agent` to trigger the agent
   - The AI will attempt to resolve the issue based on your comment

For more information about this feature, check out the [OpenHands Setup Guide](docs/openhands-setup.md).
