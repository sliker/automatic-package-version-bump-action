/**
 * Extracts the type from a title
 *
 * @param {string} title - The title of the PR
 * @returns {string|undefined} The type of the PR
 */
const extractType = title => {
  const type = title.match(/^\[(\w+!?)\]|^(\w+!?):/)
  if (!type) {
    return undefined
  }
  return type[1] || type[2]
}

module.exports = extractType
