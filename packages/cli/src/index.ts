#!/usr/bin/env node

import { Command } from 'commander'
// import { version } from '../package.json'
import { greet } from '@quickstand/core'

const program = new Command()

program
  .name('quickstand')
  .description('A modern CLI tool')
  // .version(version)

program
  .command('hello')
  .description('Say hello')
  .argument('[name]', 'Name to greet')
  .action(async (name: string = 'world') => {
    console.log(greet(name))
  })

program.parse() 