const core = require('@actions/core')
const github = require('@actions/github')
const { exec } = require('@actions/exec')

const editJsonFile = require('edit-json-file')

const getType = require('./utils/get-type')
const getNextVersion = require('./utils/get-next-version')
const extractType = require('./utils/extract-type')
const splitInput = require('./utils/split-input')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const pullRequest = github.context.payload.pull_request
    if (!pullRequest) {
      throw new Error('Pull request not found')
    }
    const prTitle = pullRequest.title
    const titleType = extractType(prTitle)
    if (!titleType) {
      throw new Error('No PR type found in title')
    }

    const patches = splitInput('patches')
    const minor = splitInput('minor')
    const major = splitInput('major')
    core.debug(`Custom Patches: ${patches}`)
    core.debug(`Custom Minor: ${minor}`)
    core.debug(`Custom Major: ${major}`)

    const type = getType(titleType, { patches, minor, major })
    if (!type) {
      throw new Error('Invalid PR type')
    }

    const authorName =
      core.getInput('commit-author-name') ||
      pullRequest.merged_by?.login ||
      'Automatic Version Bump'
    const authorEmail =
      core.getInput('commit-author-email') ||
      pullRequest.merged_by?.email ||
      'automatic-package-version-bump@users.noreply.github.com'

    core.debug(`Author Name: ${authorName}`)
    core.debug(`Author Email: ${authorEmail}`)

    await exec(`git config user.name ${authorName}`)
    await exec(`git config user.email ${authorEmail}`)

    await exec('git config pull.rebase true')

    const branch = pullRequest.base.ref
    await exec(`git pull origin ${branch}`)

    // If the PR title matches the expected pattern, read the package json version
    const packageFile = editJsonFile('./package.json')
    const packageVersion = packageFile.get('version')
    console.log('Current version:', packageVersion)
    // Get the next version based on the type of changes
    const nextVersion = getNextVersion(packageVersion, type)
    console.log('Updating package.json to version:', nextVersion)
    packageFile.set('version', nextVersion)
    packageFile.save()

    // Commit the updated package json
    await exec('git add package.json')
    await exec(
      `git commit -m "Automatically bump version from ${packageVersion} to ${nextVersion}"`
    )

    // TODO: add validation to when use force push. Code error: GH006
    await exec(`git push origin ${branch}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
