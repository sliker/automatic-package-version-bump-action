const getType = require('../../src/utils/get-type')
const { patches, minor } = require('../../src/utils/constants')

describe('getType', () => {
  for (const type of patches) {
    it(`should return patch when the type is ${type}`, () => {
      expect(getType(type)).toBe('patch')
    })
  }

  for (const type of minor) {
    it(`should return minor when the type is ${type}`, () => {
      expect(getType(type)).toBe('minor')
    })
  }

  for (const type of patches) {
    it(`should return major when the type ${type} has an exclamation mark`, () => {
      expect(getType(`${type}!`)).toBe('major')
    })
  }

  it('should return undefined when the type is not valid', () => {
    expect(getType('invalid')).toBeUndefined()
  })
})
