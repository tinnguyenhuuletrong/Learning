use std::task::Poll;
use std::future::Future;
use std::time::Instant;
use std::time::Duration;

struct Delay {
    when: Instant
}

impl Future for Delay {
    type Output = String;

    fn poll(self: std::pin::Pin<&mut Self>, cx: &mut std::task::Context<'_>) -> std::task::Poll<Self::Output> {
        if Instant::now() > self.when {
            Poll::Ready("done".to_string())
        } else  {
            cx.waker().wake_by_ref();
            Poll::Pending
        }
    }
}

#[tokio::main]
async fn main() {
    let delay = Delay{when: Instant::now() + Duration::from_millis(1000)};
    let out = delay.await;
    println!("{}", out);
}
