import chalk from "chalk";
import boxen from "boxen";
import { getGit, ensureGitRepo } from "../services/gitService.js";
import { parseGitHubRemote } from "../utils/repo.js";

function countFileStatuses(files) {
  const result = {
    staged: 0,
    modified: 0,
    untracked: 0,
    deleted: 0,
    conflicted: 0
  };

  for (const file of files) {
    if (file.index && file.index !== " ") {
      result.staged++;
    }

    if (file.working_dir === "M") {
      result.modified++;
    }

    if (file.working_dir === "?") {
      result.untracked++;
    }

    if (file.working_dir === "D" || file.index === "D") {
      result.deleted++;
    }

    if (file.index === "U" || file.working_dir === "U") {
      result.conflicted++;
    }
  }

  return result;
}

async function getRemoteInfo(git) {
  const remotes = await git.getRemotes(true);
  const origin = remotes.find((remote) => remote.name === "origin");

  if (!origin) {
    return {
      remoteName: "No remote",
      remoteUrl: "No remote URL",
      repository: "Not connected to GitHub"
    };
  }

  const remoteUrl = origin.refs.fetch || origin.refs.push;

  try {
    const { owner, repo } = parseGitHubRemote(remoteUrl);

    return {
      remoteName: origin.name,
      remoteUrl,
      repository: `${owner}/${repo}`
    };
  } catch {
    return {
      remoteName: origin.name,
      remoteUrl,
      repository: "Remote is not a valid GitHub repository"
    };
  }
}

async function getLastCommit(git) {
  try {
    const log = await git.log({ maxCount: 1 });
    const latest = log.latest;

    if (!latest) {
      return "No commits yet";
    }

    return `${latest.hash.substring(0, 7)} ${latest.message}`;
  } catch {
    return "No commits yet";
  }
}

export async function showStatus() {
  const git = getGit();

  try {
    await ensureGitRepo(git);

    const status = await git.status();
    const remoteInfo = await getRemoteInfo(git);
    const lastCommit = await getLastCommit(git);
    const counts = countFileStatuses(status.files);

    const branch = status.current || "Unknown";
    const tracking = status.tracking || "No upstream branch";
    const ahead = status.ahead || 0;
    const behind = status.behind || 0;

    const summary = [
      `${chalk.bold("Branch")}       : ${chalk.cyan(branch)}`,
      `${chalk.bold("Tracking")}     : ${chalk.cyan(tracking)}`,
      `${chalk.bold("Remote")}       : ${chalk.cyan(remoteInfo.remoteName)}`,
      `${chalk.bold("Repository")}   : ${chalk.cyan(remoteInfo.repository)}`,
      `${chalk.bold("Ahead/Behind")} : ${chalk.cyan(`${ahead} ahead, ${behind} behind`)}`,
      `${chalk.bold("Last Commit")}  : ${chalk.cyan(lastCommit)}`
    ].join("\n");

    const changes = [
      `${chalk.bold("Staged")}       : ${chalk.green(counts.staged)}`,
      `${chalk.bold("Modified")}     : ${chalk.yellow(counts.modified)}`,
      `${chalk.bold("Untracked")}    : ${chalk.magenta(counts.untracked)}`,
      `${chalk.bold("Deleted")}      : ${chalk.red(counts.deleted)}`,
      `${chalk.bold("Conflicted")}   : ${chalk.red(counts.conflicted)}`
    ].join("\n");

    console.log(
      boxen(
        `${chalk.bold.blue("Repository Status")}\n\n${summary}\n\n${chalk.bold.blue("Changes")}\n\n${changes}`,
        {
          padding: 1,
          margin: 1,
          borderStyle: "round"
        }
      )
    );

    if (status.files.length === 0) {
      console.log(chalk.green("✓ Working tree clean."));
    } else {
      console.log(chalk.yellow(`! ${status.files.length} file(s) changed.`));
    }
  } catch (error) {
    console.log(chalk.red(`✖ ${error.message}`));
  }
}