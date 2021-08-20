use actix::prelude::*;

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
    println!("Got {:?}", msg.0);
  }
}

struct HeavyJobActor {}

impl Actor for HeavyJobActor {
  type Context = Context<Self>;
}

impl Handler<Value> from HeavyJobActor {
  type Result = usize;
  fn handle(&mut self, msg: Value, _ctx: &mut Context<Self>) -> Self::Result {
    
  }
}

fn main() {
  let system = System::new();

  // Define an execution flow using futures
  let execution = async {
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
  };

  // Spawn the future onto the current Arbiter/event loop
  Arbiter::current().spawn(execution);

  // We only want to do one computation in this example, so we
  // shut down the `System` which will stop any Arbiters within
  // it (including the System Arbiter), which will in turn stop
  // any Actor Contexts running within those Arbiters, finally
  // shutting down all Actors.
  System::current().stop();

  system.run();
}
