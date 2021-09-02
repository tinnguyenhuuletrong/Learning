use std::pin::Pin;
use futures::task;
use std::task::Context;
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

type Task = Pin<Box<dyn Future<Output = ()> + Send>>;

struct MiniRunner {
  tasks: Vec<Task>
}

impl MiniRunner {
    fn new() -> MiniRunner {
      MiniRunner{
        tasks: Vec::new()
      }
    }

    fn spawn<F>(&mut self, f: F) 
    where
      F:  Future<Output = ()> + Send + 'static
    {
      self.tasks.push(Box::pin(f))
    }

    fn run(&mut self) {
      let waker = task::noop_waker();
        let mut cx = Context::from_waker(&waker);

      while let Some(mut task) =  self.tasks.pop(){
        if task.as_mut().poll(&mut cx).is_pending() {
          self.tasks.push(task)
        }
      }
    }
}


fn main() {
    let delay = Delay{when: Instant::now() + Duration::from_millis(5000)};
    let mut runner = MiniRunner::new();
    runner.spawn(async {
      let out = delay.await;
      println!("{}", out);
    });
    println!("start");
    runner.run();
    println!("end");
}
