const faker = require("faker");

const SAMPLE = 5000;
const ITEMS = Array(100)
  .fill(0)
  .map(i => ({
    productName: faker.commerce.productName(),
    cat: faker.commerce.product(),
    price: faker.commerce.price(1, 10)
  }));

console.log(ITEMS);

const RANDOMS = Array(SAMPLE)
  .fill(0)
  .map(i => {
    const itemInfo = faker.random.arrayElement(ITEMS);
    const unit = faker.random.number(10);
    const id = faker.random.uuid();
    const time = faker.date.recent(2 * 365); // 2 years
    return {
      id,
      time,
      unit,
      itemInfo
    };
  })
  .sort((a, b) => a.time.valueOf() - b.time.valueOf());

require("fs").writeFileSync("./sell_log.json", JSON.stringify(RANDOMS));
