// https://towardsdatascience.com/pandas-what-ive-learned-after-my-1st-on-site-technical-interview-4fb94dbc1b45

const dfd = require("danfojs-node");

async function main() {
  const df = await dfd.read_csv(
    "https://raw.githubusercontent.com/yunglinchang/DataScience_playground/master/Pandas/data/TheFruit_sales.csv"
  );

  global.df = df;

  //prints the first five columns
  df.head().print();

  df["Sales_Branch"] = df.column("Sales_ID").str.slice(0, 2);

  df.addColumn({
    column: "Product",
    value: df["Product_Description"].apply((x) =>
      x.split(" Product: ")[1].split(" ")
    ),
  });

  df.addColumn({
    column: "Product_Count",
    value: df["Product"].str.len(),
  });

  df.head().print();

  df.query({
    column: "Product_Count",
    is: "==",
    to: df["Product_Count"].max(),
  }).print();
}

main();
