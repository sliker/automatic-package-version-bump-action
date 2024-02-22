const getNextVersion = require('../../src/utils/get-next-version')

describe('get-next-version', () => {
  it('should bump the patch version when type is patch', () => {
    const currentVersion = '1.0.0'
    const type = 'patch'
    const nextVersion = getNextVersion(currentVersion, type)
    expect(nextVersion).toBe('1.0.1')
  })

  it('should bump the minor version when type is minor', () => {
    const currentVersion = '1.0.0'
    const type = 'minor'
    const nextVersion = getNextVersion(currentVersion, type)
    expect(nextVersion).toBe('1.1.0')
  })

  it('should bump the major version when type is major', () => {
    const currentVersion = '1.0.0'
    const type = 'major'
    const nextVersion = getNextVersion(currentVersion, type)
    expect(nextVersion).toBe('2.0.0')
  })

  it('should return the same version when is an invalid type', () => {
    const currentVersion = '1.0.0'
    const type = 'invalid'
    const nextVersion = getNextVersion(currentVersion, type)
    expect(nextVersion).toBe('1.0.0')
  })
})
