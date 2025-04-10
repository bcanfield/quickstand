import { describe, it, expect } from 'vitest'
import { greet } from './index'

describe('greet', () => {
  it('should greet with the provided name', () => {
    expect(greet('John')).toBe('Hello, John!')
  })

  it('should handle empty string', () => {
    expect(greet('')).toBe('Hello, !')
  })
}) 