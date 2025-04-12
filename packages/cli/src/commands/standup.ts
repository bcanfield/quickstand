import { Command } from 'commander';
import { StandupService } from '@quickstand/core';

const standupService = new StandupService();

export const standupCommand = new Command('standup')
  .description('Manage standups')
  .addCommand(createStandupCommand())
  .addCommand(listStandupsCommand())
  .addCommand(setDefaultStandupCommand())
  .addCommand(removeStandupCommand());

function createStandupCommand(): Command {
  return new Command('create')
    .description('Create a new standup')
    .argument('<name>', 'Name of the standup')
    .option('-d, --description <description>', 'Description of the standup')
    .action(async (name, options) => {
      try {
        const standup = await standupService.createStandup({
          name,
          description: options.description
        });
        console.log(`Standup created: ${standup.name} (${standup.id})`);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
}

function listStandupsCommand(): Command {
  return new Command('list')
    .description('List all standups')
    .action(async () => {
      try {
        const standups = await standupService.listStandups();
        if (standups.length === 0) {
          console.log('No standups found.');
          return;
        }

        console.log('Standups:');
        for (const standup of standups) {
          console.log(`- ${standup.name} (${standup.id})`);
          if (standup.description) {
            console.log(`  ${standup.description}`);
          }
        }
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
}

function setDefaultStandupCommand(): Command {
  return new Command('set-default')
    .description('Set the default standup')
    .argument('<id>', 'ID of the standup to set as default')
    .action(async (id) => {
      try {
        const standup = await standupService.setDefaultStandup(id);
        console.log(`Default standup set to: ${standup.name}`);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
}

function removeStandupCommand(): Command {
  return new Command('remove')
    .description('Remove a standup')
    .argument('<id>', 'ID of the standup to remove')
    .action(async (id) => {
      try {
        await standupService.removeStandup(id);
        console.log(`Standup removed: ${id}`);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
} 