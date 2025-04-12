# Project Guidelines

This document outlines the standards and practices for developing TypeScript projects, ensuring consistency and adherence to modern development principles, including SOLID and Test-Driven Development (TDD).

## Table of Contents

1. [Project Structure](#project-structure)
2. [Coding Standards](#coding-standards)
3. [SOLID Principles](#solid-principles)
4. [Test-Driven Development](#test-driven-development)
5. [Documentation](#documentation)
6. [Version Control](#version-control)
7. [Continuous Integration](#continuous-integration)
8. [Package Management](#package-management)

## 1. Project Structure

This project is a monorepo utilizing pnpm workspaces and Turborepo.

The project is organized as follows:

- **`/docs`**: Contains markdown documents instructing developers and AI Agents
- **`/packages`**: Contains individual packages in the monorepo
- **`/packages/cli`**: Package containing the Command Line Interface (CLI) portion of the tool
- **`/packages/core`**: Package containing the core functionality of the tool
- **`/packages/tsconfig`**: Package containing the shared typescript configuration of all other packages

### Within a Package
- **`/src`**: Contains the source code, organized into directories such as `services`, `utils`, and `types` as needed
- **`/dist`**: Outputs compiled JavaScript files
- **`/__tests__`**: Contains test files if not co-located with source files

This structure promotes modularity and maintainability.

## 2. Coding Standards

- **Consistent Naming**: Use clear and descriptive names for variables, functions, and classes.
- **Type Annotations**: Explicitly define types for function parameters and return values to leverage TypeScript's static typing.
- **Linting and Formatting**: Utilize Biome to enforce coding standards and maintain code consistency.
    - `pnpm lint:fix` Runs formatter, linter and import sorting to the project's typescript files and writes safe fixes.
    - `pnpm format` Formats the code using Biome.
    - `pnpm type-check` Runs type checking on project.
- **Error Handling**: Use proper error handling patterns and avoid silent failures.
- **Code Organization**: Keep functions and classes focused and concise. Extract reusable code into utility functions.

## 3. SOLID Principles

Adhere to the SOLID principles to create robust and maintainable code:

1. **Single Responsibility Principle**: Ensure each class or module has one responsibility.
2. **Open/Closed Principle**: Design modules that are open for extension but closed for modification.
3. **Liskov Substitution Principle**: Subtypes must be substitutable for their base types without altering the correctness of the program.
4. **Interface Segregation Principle**: Create specific interfaces rather than a single general-purpose interface.
5. **Dependency Inversion Principle**: Depend on abstractions, not on concrete implementations.

Applying these principles enhances code flexibility and testability.

## 4. Test-Driven Development

Implement TDD by following the Red-Green-Refactor cycle:

1. **Red**: Write a failing test that defines a desired improvement or function.
2. **Green**: Write the minimum amount of code necessary to pass the test.
3. **Refactor**: Optimize the code while ensuring that all tests continue to pass.

Use Vitest as the testing framework:

- **Unit Tests**: Test individual functions. Test files should be co-located next to the file it's testing with a `.test.ts` extension.
- **Coverage**: Run tests with coverage reporting using `pnpm test:coverage` to identify areas needing better test coverage.

This approach ensures code reliability and facilitates refactoring.

## 5. Documentation

- **Code Comments**: Provide clear comments for complex logic and decisions.
- **Markdown docs**: Files in the `docs` directory are to instruct agents and developers how to properly work in this repository such as project setup instructions, usage guidelines, and contribution protocols. Ensure these stay up to date, as well as `README.md`, which should be much more brief but give an overview of the repo at a glance.
- **API Documentation**: Use JSDoc comments to document functions, classes, and interfaces.
- **Update Documentation**: Ensure documentation is updated whenever code changes affect the API or usage instructions.

## 6. Version Control

- **Commit Messages**: Follow the conventional commits format for clear and structured commit messages:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for code style changes
  - `refactor:` for code refactoring
  - `test:` for test-related changes
  - `chore:` for maintenance tasks

- **Branching Strategy**: 
  - Use feature branches for new development
  - Create pull requests for code review before merging to main
  - Keep branches up to date with the main branch

## 7. Continuous Integration

- **Automated Testing**: All tests are run automatically on pull requests
- **Code Quality Checks**: Linting and formatting checks are part of the CI process
- **Build Verification**: Ensure that the build process completes successfully

## 8. Package Management

- **Package Manager**: This project uses pnpm as the package manager
- **Dependencies**: Keep dependencies up to date and regularly audit for security issues
- **Publishing**: Use changesets for versioning and publishing packages
  - Run `pnpm publish-packages` to build, test, and publish updated packages

By following these guidelines, developers can collaborate effectively, maintain high code quality, and build scalable TypeScript applications.


