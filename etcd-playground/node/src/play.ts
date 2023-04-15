import { Election, Etcd3 } from "etcd3";
import debug from "debug";
import { Campaign } from "etcd3";

const appId = `app:${process.env["APP_ID"] || process.pid}`;
const loggerInfo = debug(appId);
const loggerVerbose = debug(appId + ":verbose");
const ElectionName = "stateFullApp";

async function listAllCampaignMembers(client: Etcd3) {
  const res = await client.getAll().prefix(`election/${ElectionName}`).exec();
  const data = res.kvs.map((itm) => {
    return {
      campaignKey: itm.key.toString(),
      value: itm.value.toString(),
    };
  });
  return data;
}

async function monitorAllCampaignMembers(campaign: Campaign, client: Etcd3) {
  const watcher = await client
    .watch()
    .prefix(`election/${ElectionName}`)
    .create();

  watcher.on("data", async (changes) => {
    // TODO: better to use changes
    //     changes.events: [ { type: 'Delete', kv: [Object], prev_kv: null } ],
    const members = await listAllCampaignMembers(client);
    loggerVerbose(`Members:`, members);
  });
}

async function runWorker(campaign: Campaign) {
  loggerInfo(`campaignKey: ${await campaign.getCampaignKey()}`);
  campaign.on("elected", () => {
    // This server is now the leader! Let's start doing work
    loggerInfo("i am leader now. Rebuild memory state from previous leader");
    loggerInfo("i am leader now. Start work");

    // doSomeWork();
  });

  campaign.on("error", (error) => {
    // An error happened that caused our campaign to fail. If we were the
    // leader, make sure to stop doing work (another server is the leader
    // now) and create a new campaign.
    // console.error(error);
    loggerInfo("error", error);

    loggerInfo("i am leader now. Stop work");
    // stopDoingWork();

    // Restart worker.
    // ----- Recovery
    // setTimeout(() => {
    //   runWorker(campaign);
    // }, 5000);
  });
}

async function observeLeader(
  client: Etcd3,
  election: Election,
  intervalMs: number = 5000
) {
  const observer = await election.observe();

  observer.on("change", async (leader) => {
    loggerVerbose("The new leader is", leader);
  });

  observer.on("error", () => {
    // Something happened that fatally interrupted observation.
    setTimeout(() => {
      observeLeader(client, election, intervalMs);
    }, intervalMs);
  });

  return observer.leader();
}

async function main() {
  loggerInfo("start");

  const client = new Etcd3({ hosts: "http://localhost:2380" });
  const election = client.election("stateFullApp");
  const campaign = election.campaign(appId);

  // Monitor all members in election
  await monitorAllCampaignMembers(campaign, client);

  // Start a election
  await runWorker(campaign);

  // Observer for changed
  const leader = await observeLeader(client, election);
  loggerVerbose("ready. The current leader is", leader);

  // Gracefull shutdown
  const doExit = async () => {
    await campaign.resign();
    loggerInfo("resign");
    client.close();
    loggerInfo("end");
    process.exit(0);
  };

  process.once("SIGINT", doExit);
  process.once("SIGTERM", doExit);
}
main();
