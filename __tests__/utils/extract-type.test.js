const extractType = require('../../src/utils/extract-type')
const { patches, minor } = require('../../src/utils/constants')

describe('extractType', () => {
  const types = [...patches, ...minor]
  for (const type of types) {
    it('should return feat type if the title follows the expected [feat] pattern', () => {
      const title = `[${type}] Add new feature`
      expect(extractType(title)).toBe(type)
    })

    it('should return feat type if the title follows the expected feat: pattern', () => {
      const title = `${type}: Add new feature`
      expect(extractType(title)).toBe(type)
    })

    it('should return feat! type if the title follows the expected [feat!] pattern', () => {
      const title = `[${type}!] Add new feature`
      expect(extractType(title)).toBe(`${type}!`)
    })

    it('should return feat type if the title follows the expected feat!: pattern', () => {
      const title = `${type}!: Add new feature`
      expect(extractType(title)).toBe(`${type}!`)
    })
  }

  it('should return undefined if the title does not follow the expected pattern', () => {
    const title = 'Add new feature'
    expect(extractType(title)).toBeUndefined()
  })
})
