const util = require("util");
const moment = require("moment");
const fs = require("fs");
const GroupByTimeLabel = require("./lib/GroupByTimeLabel");
const EventSources = require("./data/sell_log");

const eventMapperFunc = event => {
  const {
    itemInfo: { cat, price, productName },
    id,
    unit
  } = event;
  return {
    [cat]: +price * +unit
    // [productName]: [id]
  };
};

const timeLabelFunc = time => {
  const t = moment.utc(time);
  const year = t
    .clone()
    .startOf("year")
    .toISOString();
  const month = t
    .clone()
    .startOf("month")
    .toISOString();
  const week = t
    .clone()
    .startOf("week")
    .toISOString();
  const day = t
    .clone()
    .startOf("day")
    .toISOString();

  return [
    [year], //
    [year, "childs", month],
    [year, "childs", month, "childs", week],
    [year, "childs", month, "childs", week, "childs", day]
  ];
};

const aggrIns = new GroupByTimeLabel({
  eventMapperFunc,
  timeLabelFunc,
  timeKeyPath: "time"
});

for (const event of EventSources) {
  aggrIns.processEvent(event);
}
fs.writeFileSync("./snapshot.json", JSON.stringify(aggrIns.snapshot));
