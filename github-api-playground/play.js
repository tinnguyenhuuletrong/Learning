const { Octokit } = require("@octokit/core");

const token = process.env.PERSONAL_TOKEN;
console.log("PERSONAL_TOKEN:", token);
const octokit = new Octokit({
  auth: token,
});

async function main() {
  await repoPrivateApi();
  // await repoApi();
  // await gitDBApi();
}

main();

async function gitDBApi() {
  let res;
  res = await octokit.request("GET /repos/{owner}/{repo}/git/ref/{ref}", {
    owner: "tinnguyenhuuletrong",
    repo: "Learning",
    ref: "heads/master",
  });
  console.log(res);

  res = await octokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    {
      owner: "tinnguyenhuuletrong",
      repo: "Learning",
      tree_sha: "236901163b426a5b5e99390b80c57fad65d8ed52",
    }
  );
  console.log(res.data);
}

async function repoApi() {
  const res = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: "tinnguyenhuuletrong",
      repo: "Learning",
      path: "webrtc-playground/python",
      ref: "master",
    }
  );

  console.log(res);
}

async function repoPrivateApi() {
  const res = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: "tinnguyenhuuletrong",
      repo: "netlifycms-4-metadata",
      path: "_metadata",
      ref: "master",
    }
  );

  console.log(res);
}
