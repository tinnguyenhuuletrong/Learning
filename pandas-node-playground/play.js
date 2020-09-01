const dfd = require("danfojs-node");

async function main() {
  const df = await dfd.read_csv(
    "https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/stuff/titanic.csv"
  );

  //prints the first five columns
  df.head().print();

  //Calculate descriptive statistics for all numerical columns
  df.describe().print();

  //prints the shape of the data
  console.log(df.shape);

  //prints all column names
  console.log(df.column_names);

  //prints the inferred dtypes of each column
  df.ctypes.print();

  //selecting a column by subsetting
  df["Name"].print();
}

main();
