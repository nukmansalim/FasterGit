import simpleGit from "simple-git";

export function getGit() {
  return simpleGit();
}

export async function ensureGitRepo(git) {
  const isRepo = await git.checkIsRepo();

  if (!isRepo) {
    throw new Error("Folder ini belum menjadi Git repository. Jalankan gitjet start dulu.");
  }
}

export async function getCurrentBranch(git) {
  const status = await git.status();

  if (!status.current) {
    throw new Error("Tidak bisa mendeteksi branch saat ini.");
  }

  return status.current;
}

export async function hasChanges(git) {
  const status = await git.status();

  return status.files.length > 0;
}