#!/usr/bin/env node

import { Command } from 'commander'

const program = new Command()

program
  .name('quickstand')
  .description('A modern CLI tool')
  .version('1.0.0')

program.parse() 