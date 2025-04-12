import { Command } from 'commander';
import { formatName } from '@quickstand/core';

export const formatCommand = new Command('format')
  .description('Format a name')
  .argument('<n>', 'Name to format')
  .action(async (name) => {
    console.log(formatName(name));
  }); 