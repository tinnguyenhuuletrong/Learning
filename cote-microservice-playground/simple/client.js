const cote = require("cote")({ environment: "dev" });

const requester = new cote.Requester({
  name: "currency conversion requester",
  key: "service",
});

const request = { type: "convert", from: "usd", to: "eur", amount: 100 };

requester.send(request, (err, res) => {
  console.log(res);
  requester.close();
});
