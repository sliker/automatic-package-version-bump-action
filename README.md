# automatic-package-version-bump

This GitHub action automates the process of updating the version property in the
package.json file of your repository, following the semantic versioning
convention. It triggers whenever there's a merge event to the specified branch.

## Usage

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
        uses: sliker/automatic-package-version-bump@v0.0.1
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
          # TOKEN needs to be a PAT with repo permissions. Store it in the Repository Secrets.
          token: ${{ secrets.TOKEN }}
      - name: Bump to next version
        uses: sliker/automatic-package-version-bump@v0.0.1
```
