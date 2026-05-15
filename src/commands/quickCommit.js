import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { getGit, ensureGitRepo, getCurrentBranch, hasChanges } from "../services/gitService.js";

export async function quickCommit(options) {
  const git = getGit();
  const spinner = ora("Checking repository...").start();

  try {
    await ensureGitRepo(git);

    const changesExist = await hasChanges(git);

    if (!changesExist) {
      spinner.info(chalk.yellow("Tidak ada perubahan untuk di-commit."));
      return;
    }

    let message = options.message;

    if (!message) {
      spinner.stop();

      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "message",
          message: "Commit message:",
          validate: (value) => value.trim() ? true : "Commit message tidak boleh kosong."
        }
      ]);

      message = answer.message;
      spinner.start("Staging changes...");
    }

    spinner.text = "Staging all changes...";
    await git.add(".");

    spinner.text = "Creating commit...";
    await git.commit(message);

    if (options.push === false) {
      spinner.succeed(chalk.green("Commit berhasil dibuat tanpa push."));
      return;
    }

    const branch = await getCurrentBranch(git);
    const status = await git.status();

    spinner.text = "Pushing changes...";

    if (!status.tracking) {
      await git.push(["--set-upstream", "origin", branch]);
    } else {
      await git.push();
    }

    spinner.succeed(chalk.green("Commit dan push berhasil."));
  } catch (error) {
    spinner.fail(chalk.red(error.message));
  }
}