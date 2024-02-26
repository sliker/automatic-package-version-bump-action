const coreMock = require('@actions/core')
const splitInput = require('../../src/utils/split-input')

jest.mock('@actions/core', () => ({
  getInput: jest.fn()
}))

describe('splitInput', () => {
  it('should return undefined when the input is empty', () => {
    coreMock.getInput.mockReturnValue('')
    expect(splitInput('patches')).toBeUndefined()
  })

  it('should return an array when the input is not empty', () => {
    coreMock.getInput.mockReturnValue('fix, bug')
    expect(splitInput('patches')).toEqual(['fix', 'bug'])
  })
})
