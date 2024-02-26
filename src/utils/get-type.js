const {
  patches: patchTypes,
  minor: minorTypes,
  major: majorTypes
} = require('./constants')

/**
 * Returns the type of the version bump according to the type.
 *
 * @param {string} type - The type of the PR
 * @param {Object} [options] - The options object
 * @param {string[]} [options.patches] - The custom patches
 * @param {string[]} [options.minor] - The custom minor types
 * @param {string[]} [options.major] - The custom major types
 *
 * @returns {string|undefined} The type of the PR
 */
const getType = (type, options = {}) => {
  const {
    patches = patchTypes,
    minor = minorTypes,
    major = majorTypes
  } = options
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
