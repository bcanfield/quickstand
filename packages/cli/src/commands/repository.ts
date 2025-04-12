import { Command } from 'commander';
import { RepositoryService } from '@quickstand/core';

const repositoryService = new RepositoryService();

export const repositoryCommand = new Command('repo')
  .description('Manage repositories')
  .addCommand(addRepositoryCommand())
  .addCommand(listRepositoriesCommand())
  .addCommand(removeRepositoryCommand());

function addRepositoryCommand(): Command {
  return new Command('add')
    .description('Add a new repository')
    .argument('<path>', 'Path to the git repository')
    .option('-n, --name <name>', 'Custom name for the repository')
    .option('-s, --standup <standupId>', 'ID of the standup to add the repository to')
    .action(async (path, options) => {
      try {
        const repository = await repositoryService.addRepository({
          path,
          name: options.name,
          standupId: options.standup
        });
        console.log(`Repository added: ${repository.name} (${repository.id})`);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
}

function listRepositoriesCommand(): Command {
  return new Command('list')
    .description('List repositories')
    .option('-s, --standup <standupId>', 'Filter repositories by standup ID')
    .action(async (options) => {
      try {
        const repositories = await repositoryService.listRepositories(options.standup);
        
        if (repositories.length === 0) {
          console.log('No repositories found.');
          return;
        }

        console.log('Repositories:');
        for (const repo of repositories) {
          const status = repo.active ? 'active' : 'inactive';
          console.log(`- ${repo.name} (${repo.id}) [${status}]`);
          console.log(`  Path: ${repo.path}`);
        }
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
}

function removeRepositoryCommand(): Command {
  return new Command('remove')
    .description('Remove a repository')
    .argument('<id>', 'ID of the repository to remove')
    .action(async (id) => {
      try {
        await repositoryService.removeRepository(id);
        console.log(`Repository removed: ${id}`);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
} 