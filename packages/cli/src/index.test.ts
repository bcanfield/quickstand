import { describe, it, expect } from 'vitest'
import { Command } from 'commander'
import { greet } from '@quickstand/core'

describe('CLI', () => {
  it('should create a program with correct name and description', () => {
    const program = new Command()
    program.name('quickstand').description('A modern CLI tool')
    
    expect(program.name()).toBe('quickstand')
    expect(program.description()).toBe('A modern CLI tool')
  })

  it('should use the greet function from core package', () => {
    const name = 'Test'
    expect(greet(name)).toBe(`Hello, ${name}!`)
  })
}) 