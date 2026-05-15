import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { getGit } from "../services/gitService.js";

async function checkRepoSafely(git) {
  try {
    return await git.checkIsRepo();
  } catch {
    return false;
  }
}

export async function startRepo(options) {
  const git = getGit();
  const spinner = ora("Preparing repository...").start();

  try {
    const isRepo = await checkRepoSafely(git);

    if (isRepo) {
      spinner.info(chalk.yellow("Repository sudah diinisialisasi."));
      return;
    }

    spinner.text = "Running git init...";
    await git.init();

    let remoteUrl = options.remote;

    if (!remoteUrl) {
      spinner.stop();

      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "addRemote",
          message: "Tambahkan remote repository sekarang?",
          default: false
        },
        {
          type: "input",
          name: "remoteUrl",
          message: "Remote URL:",
          when: (answers) => answers.addRemote,
          validate: (value) =>
            value.trim() ? true : "Remote URL tidak boleh kosong."
        }
      ]);

      remoteUrl = answer.remoteUrl;
      spinner.start("Configuring repository...");
    }

    if (remoteUrl) {
      spinner.text = "Adding remote origin...";
      await git.addRemote("origin", remoteUrl);
    }

    spinner.succeed(chalk.green("Repository berhasil dibuat."));
  } catch (error) {
    spinner.fail(chalk.red(error.message));
  }
}