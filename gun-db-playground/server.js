const GUN = require("gun");

// ext
require("gun/lib/path.js");

const gun = GUN({
  peers: ["https://gun-server-playground.herokuapp.com/gun"],
});

function simple(params) {
  gun.get("test").on((data, key) => {
    console.log("data", key);
  });
}

function relationDb(params) {
  // Users
  const markInfo = {
    name: "Mark",
    username: "@amark",
  };
  const jesseInfo = {
    name: "Jesse",
    username: "@PsychoLlama",
  };
  const mark = gun.get("user/" + markInfo.username).put(markInfo);
  const jesse = gun.get("user/" + jesseInfo.username).put(jesseInfo);

  // Posts
  const lipsum = {
    title: "Lorem ipsum dolor",
    slug: "lorem-ipsum-dolor",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  };

  // Tags
  const lorem = {
    name: "lorem",
    slug: "lorem",
  };
  const ipsum = {
    name: "ipsum",
    slug: "ipsum",
  };
  const dolor = {
    name: "dolor",
    slug: "dolor",
  };

  const lipsumPost = gun.get("post/" + lipsum.slug).put(lipsum);
  const loremTag = gun.get("tag/" + lorem.slug).put(lorem);
  const ipsumTag = gun.get("tag/" + ipsum.slug).put(ipsum);
  const dolorTag = gun.get("tag/" + dolor.slug).put(dolor);

  // Connect
  lipsumPost
    .path("author")
    .put(mark)
    .path("posts")
    .set(lipsumPost)
    .path("tags")
    .set(loremTag)
    .path("posts")
    .set(lipsumPost)
    .path("tags")
    .set(ipsumTag)
    .path("posts")
    .set(lipsumPost)
    .path("tags")
    .set(dolorTag)
    .path("posts")
    .set(lipsumPost);

  gun
    .get("user/" + markInfo.username)
    .map()
    .once((data, key) => console.log(key, "->", data));

  setInterval(() => {
    mark.get("count").set(Date.now());
  }, 1000);
}

async function seaCrypto() {
  const SEA = GUN.SEA;

  var pair = await SEA.pair();
  var enc = await SEA.encrypt("hello self", pair);
  var data = await SEA.sign(enc, pair);
  console.log("enc data:", data);

  var msg = await SEA.verify(data, pair.pub);
  var dec = await SEA.decrypt(msg, pair);
  var proof = await SEA.work(dec, pair);
  var check = await SEA.work("hello self", pair);
  console.log(dec);
  console.log(proof === check);

  // now let's share private data with someone:
  var alice = await SEA.pair();
  var bob = await SEA.pair();

  // alice -> bob
  var enc = await SEA.encrypt("shared data", await SEA.secret(bob.epub, alice));

  console.log("enc", enc);

  // bob dec
  const decMsg = await SEA.decrypt(enc, await SEA.secret(alice.epub, bob));
  console.log(decMsg);
}

async function seaUser() {
  // const uAlice = gun.user().create("alice", "qwieqowiueq@", null);
  // uAlice.get("name").put("Alice");
  // const uAlice = gun.user().auth("alice", "qwieqowiueq@");
}

// seaCrypto();
seaUser();
