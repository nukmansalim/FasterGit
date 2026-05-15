import { Octokit } from "@octokit/rest";
import inquirer from "inquirer";
import { config } from "../utils/config.js";

export async function getGitHubClient() {
  let token = process.env.GITHUB_TOKEN || config.get("githubToken");

  if (!token) {
    const answer = await inquirer.prompt([
      {
        type: "password",
        name: "token",
        message: "GitHub Personal Access Token:",
        mask: "*",
        validate: (value) => value.trim() ? true : "Token tidak boleh kosong."
      }
    ]);

    token = answer.token;
    config.set("githubToken", token);
  }

  return new Octokit({ auth: token });
}