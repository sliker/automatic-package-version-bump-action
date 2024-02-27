# automatic-package-version-bump

This GitHub action automates the process of updating the version property in the
package.json file of your repository, following the semantic versioning
convention. It triggers whenever there's a merge event to the specified branch.

## Inputs

### `commit-author-name`

**Optional** Specify the name of the author for the commit. Default to the name
of the person who merged the pull request.

### `commit-author-email`

**Optional** Specify the email of the author for the commit. Default to the
email of the person who merged the pull request.

### `patches`

**Optional** List of patches types to replace the default ones.

Default: `"fix, docs, style, refactor, perf, test, chore, build, ci, revert"`

### `minor`

**Optional** List minor types to replace the default ones.

Default: `"feat"`

### `major`

**Optional** List of major types to replace the default ones.

Default: `"!"`

## Usage

To use this action, create a pull request with a title in the following format:

```text
[<type>] <description>
```

Or

```text
type: <description>
```

Where:

`<type>` can be one of the following:

**Patches**:

- fix: A bugfix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactor or improvement
- perf: Performance improvement
- test: Adding or modifying tests
- chore: Routine tasks or maintenance
- build: Changes that affect the build of the app
- ci: Changes to CI configuration scripts and files
- revert: Reverting a commit

**Minor**:

- feat: A new feature

**Major**:

- !: A breaking change

`<description>` of the change. Example pull request titles:

- [feat] Add login functionality
- feat: Add login functionality
- [feat!] Deprecate old login functionality
- [fix] Fix formatting issue in module A
- fix: Fix formatting issue in module A
- [chore] Update dependencies
- [chore!] Major update on nodejs dependency
- chore: Update dependencies
- [docs] Update README
- docs: Update README

The action will automatically analyze the pull request title, determine the
appropriate version bump type, and update and commit the version in the
package.json file accordingly.

Please note that this action assumes your repository follows the standard
structure with a package.json file. Make sure to configure your workflow to
trigger this action on the desired events, such as a merged pull request.

**Non-protected branch**:

```yaml
name: Bump package version
on:
  pull_request:
    branches:
      - main
    types:
      - closed

jobs:
  bump:
    if: github.event.pull_request.merged == true
    name: Bump package version
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source code
        uses: actions/checkout@v4
      - name: Bump to next version
        uses: sliker/automatic-package-version-bump-action@v1
```

**Protected branch**:

```yaml
name: Bump package version
on:
  pull_request:
    branches:
      - main
    types:
      - closed

jobs:
  bump:
    if: github.event.pull_request.merged == true
    name: Bump package version
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source code
        uses: actions/checkout@v4
        with:
          # Only required to push on a protected branch.
          # TOKEN needs to be a PAT with repo permissions.
          # Store it in the Repository Secrets.
          token: ${{ secrets.TOKEN }}
      - name: Bump to next version
        uses: sliker/automatic-package-version-bump-action@v1
```
