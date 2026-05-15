import { describe, it, expect } from "vitest";
import { parseGitHubRemote } from "../src/utils/repo.js";

describe("parseGitHubRemote", () => {
  it("parses HTTPS GitHub remote", () => {
    expect(
      parseGitHubRemote("https://github.com/nukmansalim/FasterGit.git")
    ).toEqual({
      owner: "nukmansalim",
      repo: "FasterGit"
    });
  });

  it("parses SSH GitHub remote", () => {
    expect(
      parseGitHubRemote("git@github.com:nukmansalim/FasterGit.git")
    ).toEqual({
      owner: "nukmansalim",
      repo: "FasterGit"
    });
  });
});