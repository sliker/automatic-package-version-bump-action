const core = require('@actions/core')

const splitInput = inputName => {
  const input = core.getInput(inputName)
  return input ? input.split(/\s*,\s*/) : undefined
}

module.exports = splitInput
