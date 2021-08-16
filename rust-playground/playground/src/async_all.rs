use async_std::task::sleep;
use core::time::Duration;
use futures::future::FutureExt;
use futures::{join, select};

pub async fn start() {
  // promise_all().await
  promise_race().await
}

async fn promise_all() {
  let t1 = task(2);
  let t2 = task(10);
  let (a, b) = join!(t1, t2);
  println!("{:?}", (a, b));
}

async fn promise_race() {
  let t1 = task(2);
  let t2 = task(10);
  let res = select! {
    v1 = t1.fuse() => v1,
    v2 = t2.fuse() => v2
  };

  println!("res {}", res);
}

async fn task(sec: u64) -> u64 {
  sleep(Duration::from_secs(sec)).await;
  sec
}
