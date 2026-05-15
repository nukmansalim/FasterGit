# FasterGit

FasterGit is a modern command-line interface tool designed to simplify common Git and GitHub workflows. It helps developers initialize repositories, commit changes faster, push updates, and manage GitHub pull requests directly from the terminal.

This project was built as a practical developer productivity tool with a focus on clean CLI interaction, Git automation, GitHub API integration, authentication handling, and beginner-friendly workflow support.

---

## Overview

Working with Git often requires repeating the same commands multiple times, such as staging files, writing commits, pushing branches, and managing pull requests. FasterGit reduces those repetitive steps into simple commands while still keeping the workflow transparent and developer-friendly.

The tool supports both command-based usage and interactive CLI flows, making it useful for beginners who are learning Git as well as developers who want a faster terminal workflow.

---

## Key Features

- **Repository Initialization**  
  Initialize a new Git repository and optionally connect it to a GitHub remote.

- **Quick Commit Workflow**  
  Stage all changes, create a commit, and optionally push to the remote repository with one command.

- **No-Push Commit Option**  
  Create local commits without pushing them immediately.

- **GitHub Pull Request Management**  
  Create, list, and merge pull requests directly from the terminal.

- **Authentication Support**  
  Supports GitHub Personal Access Token authentication through environment variables.

- **Interactive CLI Mode**  
  Provides a menu-driven workflow for users who prefer guided interaction.

- **Styled Terminal Output**  
  Uses clean visual feedback, loading indicators, and readable messages to improve command-line experience.

- **Safer Workflow Handling**  
  Includes validation for Git repository status, missing remotes, invalid tokens, and protected branch workflows.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Commander.js | CLI command routing |
| Simple Git | Git command automation |
| Octokit REST | GitHub API integration |
| Inquirer | Interactive terminal prompts |
| Chalk | Styled terminal output |
| Ora | Loading indicators |
| Boxen | Terminal banner UI |
| Conf | Local configuration storage |

---

## Project Structure

```bash
FasterGit/
├── src/
│   ├── commands/
│   │   ├── quickCommit.js
│   │   ├── startRepo.js
│   │   └── pullRequest.js
│   ├── services/
│   │   ├── gitService.js
│   │   └── githubService.js
│   ├── interactive/
│   │   └── index.js
│   ├── utils/
│   │   ├── config.js
│   │   └── repo.js
│   └── index.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/nukmansalim/FasterGit.git
cd FasterGit
```

Install dependencies:

```bash
npm install
```

Link the CLI globally for local development:

```bash
npm link
```

Verify installation:

```bash
fastergit --help
```

---

## Usage

### Show Help

```bash
fastergit --help
```

### Initialize a Git Repository

```bash
fastergit start
```

You can also add a remote repository during the setup flow.

### Quick Commit Without Push

```bash
fastergit quickcommit -m "feat: add new feature" --no-push
```

This command will:

```bash
git add .
git commit -m "feat: add new feature"
```

### Quick Commit With Push

```bash
fastergit quickcommit -m "fix: update authentication flow"
```

This command will:

```bash
git add .
git commit -m "fix: update authentication flow"
git push
```

If the branch has no upstream remote, FasterGit will attempt to set the upstream branch automatically.

---

## GitHub Authentication

FasterGit uses GitHub authentication for pull request operations.

Create a GitHub Personal Access Token with the required repository permissions, then set it as an environment variable.

For Bash or Zsh:

```bash
export GITHUB_TOKEN="your_github_token_here"
```

For Fish shell:

```fish
set -gx GITHUB_TOKEN "your_github_token_here"
```

> Never commit your GitHub token to the repository.

---

## Pull Request Commands

### List Open Pull Requests

```bash
fastergit pr --list
```

### Create a Pull Request

Before creating a pull request, make sure you are on a feature branch:

```bash
git checkout -b feat/example-feature
```

Push the branch:

```bash
git push -u origin feat/example-feature
```

Then create a pull request:

```bash
fastergit pr --create
```

FasterGit will ask for:

- Pull request title
- Pull request description
- Base branch

### Merge a Pull Request

```bash
fastergit pr --merge 1
```

Replace `1` with the pull request number.

### Show Repository Status

```bash
fastergit status
```
Displays a clean summary of the current repository, including branch, tracking status, remote repository, last commit, and changed file counts.

---


## Example Workflow

```bash
# Initialize repository
fastergit start

# Create or update a file
echo "Hello FasterGit" > test.txt

# Commit locally without pushing
fastergit quickcommit -m "test: add initial file" --no-push

# Add remote manually if needed
git remote add origin https://github.com/username/repository.git

# Push changes
fastergit quickcommit -m "feat: update project files"

# Create feature branch
git checkout -b feat/new-feature

# Make changes and push branch
fastergit quickcommit -m "feat: add new feature"

# Create pull request
fastergit pr --create

# List pull requests
fastergit pr --list

# Merge pull request
fastergit pr --merge 1
```

---

## Error Handling

FasterGit includes handling for common workflow issues, including:

- Running commit commands outside a Git repository
- Empty working tree with no changes to commit
- Missing remote repository
- Invalid GitHub token
- Attempting to create pull requests from `main` or `master`
- Branches that already track remote branches
- Authentication prompts during push operations

---

## Development

Run the project directly without global linking:

```bash
npm run dev
```

Run formatting:

```bash
npm run format
```

Run linting:

```bash
npm run lint
```

Run tests:

```bash
npm test
```

---

## Current Status

FasterGit is currently in the MVP stage. The core Git and GitHub workflows are functional and have been manually tested, including:

- CLI command registration
- Repository initialization
- Local quick commits
- Quick commits with push
- GitHub token authentication
- Pull request listing
- Pull request creation
- Pull request merging
- Invalid token handling

---

## Roadmap

Planned improvements:

- Add `fastergit status` command
- Add `fastergit branch` command
- Add conventional commit helper
- Add automated tests for command handlers
- Add GitHub Actions CI workflow
- Add npm package publishing support
- Improve token storage with a secure keychain-based approach

---

## Security Notes

- Do not store GitHub tokens directly in source code.
- Do not commit `.env` files.
- Use environment variables for authentication.
- Revoke exposed tokens immediately.
- Prefer fine-grained GitHub tokens with limited repository access.

---

## Why This Project Matters

FasterGit demonstrates practical skills in:

- CLI application development
- Git workflow automation
- GitHub REST API integration
- Authentication handling
- Terminal UX design
- Node.js modular architecture
- Error handling and developer tooling

This project is designed not only as a utility tool, but also as a portfolio project that reflects real-world developer workflow automation.

---

## Author

Created by [Nukman Salim](https://github.com/nukmansalim)

---

## License

This project is licensed under the MIT License.
