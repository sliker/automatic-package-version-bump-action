/**
 * Unit tests for the action's main functionality, src/main.js
 */
const github = require('@actions/github')
const core = require('@actions/core')
const editJsonFile = require('edit-json-file')

const main = require('../src/main')

const runMock = jest.spyOn(main, 'run')

jest.mock('@actions/github')
jest.mock('edit-json-file')
jest.mock('@actions/exec', () => ({
  ...jest.requireActual('@actions/exec'),
  exec: jest.fn()
}))

describe('action', () => {
  const getContextMock = overwrite => ({
    payload: {
      pull_request: {
        number: 1,
        title: 'feat: add new feature',
        base: {
          ref: 'main'
        }
      }
    },
    ...overwrite
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should run the action', async () => {
    await main.run()
    expect(runMock).toHaveBeenCalled()
  })

  it('should fail if there is no a pull request in the context', async () => {
    github.context = getContextMock({ payload: {} })
    const setFailedMock = jest.spyOn(core, 'setFailed')
    await main.run()
    expect(setFailedMock).toHaveBeenCalledWith('Pull request not found')
  })

  it('should fail if there is no type in the PR title', async () => {
    github.context = getContextMock({
      payload: { pull_request: { title: 'add new feature' } }
    })
    const setFailedMock = jest.spyOn(core, 'setFailed')
    await main.run()
    expect(setFailedMock).toHaveBeenCalledWith('No PR type found in title')
  })

  it('should fail if is an invalid type', async () => {
    github.context = getContextMock({
      payload: { pull_request: { title: 'invalid: add new feature' } }
    })
    const setFailedMock = jest.spyOn(core, 'setFailed')
    await main.run()
    expect(setFailedMock).toHaveBeenCalledWith('Invalid PR type')
  })

  it('should update the minor version in the package.json', async () => {
    github.context = getContextMock()

    const setMock = jest.fn()
    const saveMock = jest.fn()
    editJsonFile.mockReturnValue({
      get: jest.fn().mockReturnValue('1.2.2'),
      set: setMock,
      save: saveMock
    })

    await main.run()
    expect(setMock).toHaveBeenCalledWith('version', '1.3.2')
    expect(saveMock).toHaveBeenCalledTimes(1)
  })

  it('should update the patch version in the package.json', async () => {
    github.context = getContextMock({
      payload: {
        pull_request: {
          ...getContextMock().payload.pull_request,
          title: 'fix: add new feature'
        }
      }
    })

    const setMock = jest.fn()
    const saveMock = jest.fn()
    editJsonFile.mockReturnValue({
      get: jest.fn().mockReturnValue('1.2.2'),
      set: setMock,
      save: saveMock
    })

    await main.run()
    expect(setMock).toHaveBeenCalledWith('version', '1.2.3')
    expect(saveMock).toHaveBeenCalledTimes(1)
  })

  it('should update the major version in the package.json', async () => {
    github.context = getContextMock({
      payload: {
        pull_request: {
          ...getContextMock().payload.pull_request,
          title: 'feat!: add new feature'
        }
      }
    })

    const setMock = jest.fn()
    const saveMock = jest.fn()
    editJsonFile.mockReturnValue({
      get: jest.fn().mockReturnValue('1.2.2'),
      set: setMock,
      save: saveMock
    })

    await main.run()
    expect(setMock).toHaveBeenCalledWith('version', '2.0.0')
    expect(saveMock).toHaveBeenCalledTimes(1)
  })
})
