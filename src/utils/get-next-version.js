/**
 * Return the next version following semantic version rules.
 *
 * @param {string} version - The current package version.
 * @param {string} type - The type of changes.
 *
 * @returns {string} The next version following semantic version rules.
 */
const getNextVersion = (currentVersion, type) => {
  const [major, minor, patch] = currentVersion.split('.').map(Number)
  switch (type) {
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    case 'minor':
      return `${major}.${minor + 1}.${patch}`
    case 'major':
      return `${major + 1}.${minor}.${patch}`
    default:
      return currentVersion
  }
}

module.exports = getNextVersion
