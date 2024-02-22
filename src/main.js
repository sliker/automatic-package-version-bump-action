const core = require('@actions/core')
const github = require('@actions/github')
const { exec } = require('@actions/exec')

const editJsonFile = require('edit-json-file')

const getType = require('./utils/get-type')
const getNextVersion = require('./utils/get-next-version')
const extractType = require('./utils/extract-type')

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
    // Get PR title from Github context
    const prTitle = pullRequest.title
    // Check if PR type is in the title
    const titleType = extractType(prTitle)
    if (!titleType) {
      throw new Error('No PR type found in title')
    }
    // Get the type of the changes
    const type = getType(titleType)
    if (!type) {
      throw new Error('Invalid PR type')
    }
    // If the PR title matches the expected pattern, read the package json version
    const packageFile = editJsonFile('./package.json')
    const packageVersion = packageFile.get('version')
    console.log('Current version:', packageVersion)
    // Get the next version based on the type of changes
    const nextVersion = getNextVersion(packageVersion, type)
    console.log('Updating package.json to version:', nextVersion)
    packageFile.set('version', nextVersion)
    packageFile.save()

    // await exec(`git config user.name ${pullRequest.merged_by.login}`)
    // await exec(`git config user.email ${pullRequest.merged_by.email}`)
    await exec(`git config --global user.name "Automatic Version Bump"`)
    await exec(`git config --global user.email zero.blend@gmail.com`)

    // Commit the updated package json
    await exec('git add package.json')
    await exec(
      `git commit -m "Bump version from ${packageVersion} to ${nextVersion}"`
    )

    await exec(`git push origin`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
