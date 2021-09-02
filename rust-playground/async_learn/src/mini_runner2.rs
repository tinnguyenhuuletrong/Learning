use std::pin::Pin;
use std::sync::Mutex;
use std::task::Context;
use futures::task;
use futures::task::ArcWake;
use std::task::Poll;
use std::future::Future;
use std::time::Instant;
use std::time::Duration;
use crossbeam::channel;
use std::sync::Arc;

struct Delay {
    when: Instant
}

impl Future for Delay {
    type Output = String;

    fn poll(self: std::pin::Pin<&mut Self>, cx: &mut std::task::Context<'_>) -> std::task::Poll<Self::Output> {
        if Instant::now() > self.when {
            Poll::Ready("done".to_string())
        } else  {
          let waker = cx.waker().clone();
          let when = self.when;

          // Sleep in thread and notify walker
          std::thread::spawn(move || {
            std::thread::sleep(when - Instant::now() );
            waker.wake();
          });

          Poll::Pending
        }
    }
}

struct Task {
  // The `Mutex` is to make `Task` implement `Sync`. Only
  // one thread accesses `future` at any given time. The
  // `Mutex` is not required for correctness. Real Tokio
  // does not use a mutex here, but real Tokio has
  // more lines of code than can fit in a single tutorial
  // page.
  future: Mutex<Pin<Box<dyn Future<Output = ()> + Send>>>,
  executor: channel::Sender<Arc<Task>>,
}

impl ArcWake for Task {
  fn wake(self: Arc<Self>) {
    self.schedule()
  }
  
  fn wake_by_ref(arc_self: &Arc<Self>) {
      arc_self.schedule();
  }
}
impl Task {
  fn schedule(self: &Arc<Self>) {
      self.executor.send(self.clone()).unwrap();
  }

  fn poll(self: Arc<Self>) -> Poll<()> {
      let waker = task::waker(self.clone());
      let mut cx = Context::from_waker(&waker);

      let mut future = self.future.try_lock().unwrap();

      // Poll the future
      future.as_mut().poll(&mut cx)
  }

 
  fn spawn<F>(future: F, sender: &channel::Sender<Arc<Task>>)
  where
      F: Future<Output = ()> + Send + 'static,
  {
      let task = Arc::new(Task {
          future: Mutex::new(Box::pin(future)),
          executor: sender.clone(),
      });

      let _ = sender.send(task);
  }

}


struct MiniRunner2 {
  scheduled: channel::Receiver<Arc<Task>>,
  sender: channel::Sender<Arc<Task>>,
  running_count: u32
}

impl MiniRunner2 {
    fn new() -> MiniRunner2 {
      let (sender, scheduled) = channel::unbounded();
      MiniRunner2{
        sender,
        scheduled,
        running_count: 0
      }
    }

    fn spawn<F>(&mut self, f: F) 
    where
      F:  Future<Output = ()> + Send + 'static
    {
      Task::spawn(f, &self.sender);
      self.running_count +=1;
    }

    fn run(&mut self) {
     while let Ok(task) = self.scheduled.recv() {
        match task.poll() {
          Poll::Ready(_) => self.running_count -=1,
          _ => {}
        }

        if self.running_count <= 0{ 
          break
        }
     }
    }
}

fn main() {
    let mut runner = MiniRunner2::new();
    runner.spawn(async move {
      let delay = Delay{when: Instant::now() + Duration::from_millis(5000)};
      let out = delay.await;
      println!("5sec {}", out);
    });
    runner.spawn(async move {
      let delay = Delay{when: Instant::now() + Duration::from_millis(2000)};
      let out = delay.await;
      println!("2sec {}", out);
    });
    runner.spawn(async move {
      let delay = Delay{when: Instant::now() + Duration::from_millis(8000)};
      let out = delay.await;
      println!("10sec {}", out);
    });
    runner.spawn(async move {
    });
    println!("start");
    runner.run();
    println!("end");
}
