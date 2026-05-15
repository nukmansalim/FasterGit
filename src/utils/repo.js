export function parseGitHubRemote(remoteUrl) {
  if (!remoteUrl) {
    throw new Error("Remote origin tidak ditemukan.");
  }

  const httpsMatch = remoteUrl.match(/github\.com\/([^/]+)\/(.+?)(\.git)?$/);
  const sshMatch = remoteUrl.match(/github\.com:([^/]+)\/(.+?)(\.git)?$/);

  const match = httpsMatch || sshMatch;

  if (!match) {
    throw new Error("Remote origin bukan URL GitHub yang valid.");
  }

  return {
    owner: match[1],
    repo: match[2].replace(".git", "")
  };
}