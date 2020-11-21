const cote = require("cote")({ environment: "dev" });

const publisher = new cote.Publisher({
  name: "admin publisher",
  broadcasts: ["rate updated"],
  key: "admin",
});

publisher.onAny(console.log);

const rates = {
  currencies: "usd_eur",
  rate: 5,
};

// continuous discovery
// handle added
publisher.on("cote:added", () => {});

setTimeout(() => {
  console.log("send rate update");
  publisher.publish("rate updated", rates);
}, 1000);
