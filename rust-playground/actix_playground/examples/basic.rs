use actix::prelude::*;

// Message
#[derive(Message)]
#[rtype(result = "Result<Res, Res>")]
enum Msg {
  Add(i32),
  Sub(i32),
  Get,
}

#[derive(Debug)]
enum Res {
  Success(i32),
  Error(String),
}

// Actor
struct MyActor {
  balance: i32,
}

impl Actor for MyActor {
  type Context = Context<Self>;

  fn started(&mut self, _ctx: &mut Context<Self>) {
    println!("Actor is alive");
  }

  fn stopped(&mut self, _ctx: &mut Context<Self>) {
    println!("Actor is stopped");
  }
}

// Actor handle message ping
impl Handler<Msg> for MyActor {
  type Result = Result<Res, Res>;

  fn handle(&mut self, msg: Msg, _ctx: &mut Context<Self>) -> Self::Result {
    match msg {
      Msg::Add(a) => self.balance += a,
      Msg::Sub(a) => {
        if self.balance - a < 0 {
          return Err(Res::Error(String::from("Not enough balance")));
        }
        self.balance -= a;
      }
      _ => {}
    }
    Ok(Res::Success(self.balance))
  }
}

#[actix_rt::main]
async fn main() {
  let addr = MyActor { balance: 10 }.start();

  // send message
  //  msg will process in sequence
  addr.send(Msg::Add(10)).await;
  let res = addr.send(Msg::Sub(30)).await;
  println!("Sub Result: {:?}", res.unwrap());

  let res = addr.send(Msg::Get).await;

  // handle() returns tokio handle
  println!("RESULT: {:?}", res.unwrap());

  // stop system and exit
  System::current().stop();
}
