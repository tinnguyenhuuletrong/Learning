const cote = require("cote")({ environment: "dev" });

const responder = new cote.Responder({
  name: "currency conversion responder",
  key: "service",
});
const subscriber = new cote.Subscriber({
  name: "admin subscriber",
  subscribesTo: ["rate updated"],
  key: "admin",
});

const rates = { usd_eur: 0.91, eur_usd: 1.1 };

subscriber.on("rate updated", (update) => {
  rates[update.currencies] = update.rate;
  console.info("rate updated", rates);
});

responder.on("convert", (req, cb) => {
  const convertedRate = req.amount * rates[`${req.from}_${req.to}`];

  cb(null, `${req.amount} ${req.from} => ${convertedRate} ${req.to}`);
});
