# Contributing to Quickstand

Thank you for your interest in contributing to Quickstand! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. **Prerequisites**
   - Node.js (latest LTS version recommended)
   - pnpm (latest version)

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/quickstand.git
   cd quickstand

   # Install dependencies
   pnpm install
   ```

3. **Development Workflow**
   - Use `pnpm dev` to start the development server with watch mode
   - Use `pnpm build` to build the project
   - Use `pnpm test` to run tests
   - Use `pnpm lint` to check code quality
   - Use `pnpm format` to format code

## Code Style

- We use Biome for linting and formatting
- TypeScript strict mode is enabled
- Follow the existing code style and patterns
- Write tests for new features

## Testing

- Tests are written using Vitest
- Place test files next to the source files with `.test.ts` extension
- Run `pnpm test` to execute tests
- Run `pnpm test:coverage` to generate coverage reports

## Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request with a clear description

## Commit Messages

Follow conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for test-related changes
- `chore:` for maintenance tasks

## License

By contributing to this project, you agree that your contributions will be licensed under the project's ISC license. 