const repl = require("repl");
const path = require("path");
const fse = require("fs-extra");
const Git = require("nodegit");

const repoPath = "./_repo";

/** @type {import('nodegit').Repository} */
let repo;
async function main() {
  repo = await Git.Repository.init(repoPath, 0);
  global.repo = repo;
}

async function addFile(fileName, fileContent, message) {
  const index = await repo.index();

  const filePath = path.join(repoPath, fileName);
  console.log(filePath, path.relative(repoPath, filePath));
  await fse.ensureDir(path.dirname(filePath));
  await fse.writeFile(filePath, fileContent);
  await index.addByPath(path.relative(repoPath, filePath));
  await index.write();

  const oid = await index.writeTree();

  let parents = [];
  try {
    const HEAD = await Git.Reference.nameToId(repo, "HEAD");
    const head = await repo.getCommit(HEAD);
    parents = [head];
  } catch (error) {}

  var author = Git.Signature.now("Play 1", "play1@play.com");
  var committer = Git.Signature.now("Play 1", "play1@play.com");
  const commitId = await repo.createCommit(
    "HEAD",
    author,
    committer,
    message || "missing_message",
    oid,
    parents
  );
}

async function showHistory() {
  const commit = await repo.getMasterCommit();
  const history = commit.history(Git.Revwalk.SORT.TIME);

  history.on("commit", function(commit) {
    console.log("commit " + commit.sha());
    console.log(
      "Author:",
      commit.author().name() + " <" + commit.author().email() + ">"
    );
    console.log("Date:", commit.date());
    console.log("\n    " + commit.message());
  });

  history.start();
}

async function readFile(fileName) {
  const commit = await repo.getMasterCommit();
  const entry = await commit.getEntry(fileName);
  const blob = await entry.getBlob();

  console.log(entry.name(), entry.sha(), blob.rawsize() + "b");
  console.log("========================================================\n\n");
  var firstTenLines = blob
    .toString()
    .split("\n")
    .slice(0, 10)
    .join("\n");
  console.log(firstTenLines);
  console.log("...");
}

async function showTree() {
  const commit = await repo.getMasterCommit();
  const tree = await commit.getTree();

  console.log("========================================================\n\n");

  var walker = tree.walk();
  walker.on("entry", function(entry) {
    console.log(entry.path());
  });
  walker.start();
}

async function showHead() {
  const commit = await repo.getMasterCommit();
  console.log(commit.sha());
}

global.addFile = addFile;
global.readFile = readFile;
global.showHistory = showHistory;
global.showTree = showTree;
global.showHead = showHead;

function help() {
  console.log("========================================================\n\n");
  console.log("addFile");
  console.log("readFile");
  console.log("showHistory");
  console.log("showTree");
  console.log("showHead");
  console.log("========================================================\n\n");
}

main();

repl.start({ useGlobal: true });
console.log(help());
