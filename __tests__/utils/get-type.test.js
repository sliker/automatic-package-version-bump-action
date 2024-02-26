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

  it('should return patch when is a custom patch type', () => {
    const customPatches = ['custom-patch']
    expect(getType('custom-patch', { patches: customPatches })).toBe('patch')
    expect(getType('feat', { patches: customPatches })).toBe('minor')
  })

  it('should return minor when is a custom minor type', () => {
    expect(getType('custom-minor', { minor: ['custom-minor'] })).toBe('minor')
  })

  it('should return major when is a custom major type', () => {
    expect(getType('custom-major', { major: ['custom-major'] })).toBe('major')
  })

  it('should return default type when custom type is undefined', () => {
    expect(getType('fix', { patches: undefined })).toBe('patch')
    expect(getType('feat', { minor: undefined })).toBe('minor')
    expect(getType('feat!', { major: undefined })).toBe('major')
  })
})
