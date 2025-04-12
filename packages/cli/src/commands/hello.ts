import { Command } from 'commander';
import { greet } from '@quickstand/core';

export const helloCommand = new Command('hello')
  .description('Say hello')
  .argument('[name]', 'Name to greet')
  .action(async (name = 'world') => {
    console.log(greet(name));
  }); 