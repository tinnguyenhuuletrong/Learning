fn main() {
  futures::executor::block_on(start())
}

async fn start() {
  let res = foo_async().await;
  println!("{}", res)
}

async fn foo_async() -> u32 {
  println!("start foo");
  println!("end foo");
  0
}
