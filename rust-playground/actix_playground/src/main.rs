use actix::prelude::*;
use std::time::Duration;

struct SumActor {}

impl Actor for SumActor {
  type Context = Context<Self>;
}

#[derive(Message)]
#[rtype(result = "usize")]
struct Value(usize, usize);

impl Handler<Value> for SumActor {
  type Result = usize;

  fn handle(&mut self, msg: Value, _ctx: &mut Context<Self>) -> Self::Result {
    msg.0 + msg.1
  }
}

struct DisplayActor {}

impl Actor for DisplayActor {
  type Context = Context<Self>;
}

#[derive(Message)]
#[rtype(result = "()")]
struct Display(usize);

impl Handler<Display> for DisplayActor {
  type Result = ();

  fn handle(&mut self, msg: Display, _ctx: &mut Context<Self>) -> Self::Result {
    let thread_id = std::thread::current().id();
    println!("{:?} Got {:?}", thread_id, msg.0);
  }
}

struct HeavyJobActor {}

impl Actor for HeavyJobActor {
  type Context = SyncContext<Self>;
}

impl Handler<Value> for HeavyJobActor {
  type Result = usize;
  fn handle(&mut self, msg: Value, _ctx: &mut SyncContext<Self>) -> Self::Result {
    let thread_id = std::thread::current().id();
    println!("{:?} HeavyJobActor processing", thread_id);
    std::thread::sleep(Duration::from_millis(2000));
    println!("{:?} HeavyJobActor finish {}", thread_id, msg.0 + msg.1);
    msg.0 + msg.1
  }
}

fn main() {
  let system = System::new();

  // 10 worker for thread pool
  let heavy_addr = SyncArbiter::start(10, || HeavyJobActor {});

  // Spawn the future onto the current Arbiter/event loop
  Arbiter::current().spawn(async move {
    // `Actor::start` spawns the `Actor` on the *current* `Arbiter`, which
    // in this case is the System arbiter
    let sum_addr = SumActor {}.start();
    let dis_addr = DisplayActor {}.start();

    // Start by sending a `Value(6, 7)` to our `SumActor`.
    // `Addr::send` responds with a `Request`, which implements `Future`.
    // When awaited, it will resolve to a `Result<usize, MailboxError>`.
    let sum_result = sum_addr.send(Value(6, 7)).await;

    match sum_result {
      Ok(res) => {
        // `res` is now the `usize` returned from `SumActor` as a response to `Value(6, 7)`
        // Once the future is complete, send the successful response (`usize`)
        // to the `DisplayActor` wrapped in a `Display
        dis_addr.send(Display(res)).await;
      }
      Err(e) => {
        eprintln!("Encountered mailbox error: {:?}", e);
      }
    };

    // Call to SyncArbiter ( difference thread )
    for i in 1..10 {
      heavy_addr.do_send(Value(i, i));
    }
    let sum_result = heavy_addr.send(Value(1, 2)).await;
    match sum_result {
      Ok(res) => {
        // `res` is now the `usize` returned from `SumActor` as a response to `Value(6, 7)`
        // Once the future is complete, send the successful response (`usize`)
        // to the `DisplayActor` wrapped in a `Display
        dis_addr.send(Display(res)).await;
      }
      Err(e) => {
        eprintln!("Encountered mailbox error: {:?}", e);
      }
    };
  });

  system.run();
}