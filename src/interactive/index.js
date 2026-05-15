import inquirer from "inquirer";
import { quickCommit } from "../commands/quickCommit.js";
import { startRepo } from "../commands/startRepo.js";
import { handlePR } from "../commands/pullRequest.js";

export async function interactiveMode() {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Apa yang ingin kamu lakukan?",
      choices: [
        "Quick Commit",
        "Start Repo",
        "Manage Pull Requests",
        "Exit"
      ]
    }
  ]);

  switch (answer.action) {
    case "Quick Commit":
      return quickCommit({});
    case "Start Repo":
      return startRepo({});
    case "Manage Pull Requests":
      return handlePR({});
    case "Exit":
      console.log("Bye 👋");
      return;
  }
}