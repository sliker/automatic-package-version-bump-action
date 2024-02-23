const { patches, minor, major } = require('./constants')

/**
 * Returns the type of the version bump according to the type.
 *
 * @param {string} type - The type of the PR
 * @returns {string|undefined} The type of the PR
 */
const getType = type => {
  if (patches.includes(type)) {
    return 'patch'
  } else if (minor.includes(type)) {
    return 'minor'
  } else if (type.includes(major)) {
    return 'major'
  }
  return undefined
}

module.exports = getType
