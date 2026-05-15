#!/usr/bin/env node


import { program } from "commander";
import chalk from "chalk";
import boxen from "boxen";
import { quickCommit } from "./commands/quickCommit.js";
import { startRepo } from "./commands/startRepo.js";
import { handlePR } from "./commands/pullRequest.js";
import { showStatus } from "./commands/status.js";
import { interactiveMode } from "./interactive/index.js";

console.log(
  boxen(chalk.bold.blue("🚀 FasterGit\n") + chalk.gray("Save your time when working with Git and GitHub"), {
    padding: 1,
    margin: 1,
    borderStyle: "round"
  })
);

program
  .name("fastergit")
  .description("Modern CLI for Git and GitHub workflows")
  .version("1.0.0");

program
  .command("quickcommit")
  .description("Add, commit, and push all changes")
  .option("-m, --message <message>", "Commit message")
  .option("--no-push", "Commit without pushing")
  .action(quickCommit);

program
  .command("start")
  .description("Initialize a new Git repository")
  .option("-r, --remote <url>", "Remote repository URL")
  .action(startRepo);

program
  .command("pr")
  .description("Manage GitHub pull requests")
  .option("-c, --create", "Create pull request")
  .option("-l, --list", "List pull requests")
  .option("-m, --merge <number>", "Merge pull request by number")
  .action(handlePR);

program
  .command("status")
  .description("Show a clean summary of the current Git repository status")
  .action(showStatus);

program.action(interactiveMode);

program.parse();