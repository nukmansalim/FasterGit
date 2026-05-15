import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { getGit, ensureGitRepo, getCurrentBranch } from "../services/gitService.js";
import { getGitHubClient } from "../services/githubService.js";
import { parseGitHubRemote } from "../utils/repo.js";

async function getRepoContext() {
  const git = getGit();

  await ensureGitRepo(git);

  const remotes = await git.getRemotes(true);
  const origin = remotes.find((remote) => remote.name === "origin");

  if (!origin) {
    throw new Error("Remote origin tidak ditemukan.");
  }

  const remoteUrl = origin.refs.fetch || origin.refs.push;
  const { owner, repo } = parseGitHubRemote(remoteUrl);
  const branch = await getCurrentBranch(git);

  return { git, owner, repo, branch };
}

export async function handlePR(options) {
  if (options.create) return createPR();
  if (options.list) return listPRs();
  if (options.merge) return mergePR(Number(options.merge));

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Pilih aksi Pull Request:",
      choices: ["Create PR", "List PRs", "Merge PR"]
    }
  ]);

  if (answer.action === "Create PR") return createPR();
  if (answer.action === "List PRs") return listPRs();

  const mergeAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "number",
      message: "Nomor PR:",
      validate: (value) => Number(value) > 0 ? true : "Masukkan nomor PR yang valid."
    }
  ]);

  return mergePR(Number(mergeAnswer.number));
}

async function createPR() {
  const spinner = ora("Creating pull request...").start();

  try {
    const octokit = await getGitHubClient();
    const { git, owner, repo, branch } = await getRepoContext();

    if (branch === "main" || branch === "master") {
      throw new Error("Jangan buat PR dari branch utama. Buat feature branch dulu.");
    }

    spinner.stop();

    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "PR title:",
        validate: (value) => value.trim() ? true : "Title tidak boleh kosong."
      },
      {
        type: "input",
        name: "body",
        message: "PR description:",
        default: "Created with GitJet"
      },
      {
        type: "input",
        name: "base",
        message: "Base branch:",
        default: "main"
      }
    ]);

    spinner.start("Pushing current branch...");
    await git.push(["--set-upstream", "origin", branch]);

    spinner.text = "Calling GitHub API...";

    const response = await octokit.rest.pulls.create({
      owner,
      repo,
      title: answer.title,
      body: answer.body,
      head: branch,
      base: answer.base
    });

    spinner.succeed(chalk.green(`PR created: ${response.data.html_url}`));
  } catch (error) {
    spinner.fail(chalk.red(error.message));
  }
}

async function listPRs() {
  const spinner = ora("Fetching pull requests...").start();

  try {
    const octokit = await getGitHubClient();
    const { owner, repo } = await getRepoContext();

    const response = await octokit.rest.pulls.list({
      owner,
      repo,
      state: "open"
    });

    spinner.stop();

    if (response.data.length === 0) {
      console.log(chalk.yellow("Tidak ada open pull request."));
      return;
    }

    console.log(chalk.bold("\nOpen Pull Requests:\n"));

    for (const pr of response.data) {
      console.log(chalk.cyan(`#${pr.number}`), pr.title);
      console.log(chalk.gray(`Branch: ${pr.head.ref} → ${pr.base.ref}`));
      console.log(chalk.gray(pr.html_url));
      console.log("");
    }
  } catch (error) {
    spinner.fail(chalk.red(error.message));
  }
}

async function mergePR(number) {
  const spinner = ora(`Merging PR #${number}...`).start();

  try {
    if (!number || Number.isNaN(number)) {
      throw new Error("Nomor PR tidak valid.");
    }

    const octokit = await getGitHubClient();
    const { owner, repo } = await getRepoContext();

    const response = await octokit.rest.pulls.merge({
      owner,
      repo,
      pull_number: number,
      merge_method: "squash"
    });

    if (response.data.merged) {
      spinner.succeed(chalk.green(`PR #${number} berhasil di-merge.`));
    } else {
      spinner.fail(chalk.red(response.data.message || "PR gagal di-merge."));
    }
  } catch (error) {
    spinner.fail(chalk.red(error.message));
  }
}