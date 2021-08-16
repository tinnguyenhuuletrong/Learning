use std::time::Duration;
use tokio::time::sleep;

// #[tokio::main]
// async fn main() {
//   start().await;
// }

async fn start() {
  let res = foo_async().await;
  println!("{}", res)
}

async fn foo_async() -> u32 {
  println!("start foo");
  sleep(Duration::from_secs(10)).await;
  println!("end foo");
  0
}
