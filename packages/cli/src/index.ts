#!/usr/bin/env node

// import { version } from '../package.json'
import { Command } from 'commander';
import { 
  helloCommand, 
  formatCommand, 
  standupCommand, 
  repositoryCommand 
} from './commands';

const program = new Command();

program.name('quickstand').description('A modern CLI tool');
// .version(version)

program.addCommand(helloCommand);
program.addCommand(formatCommand);
program.addCommand(standupCommand);
program.addCommand(repositoryCommand);

program.parse();
