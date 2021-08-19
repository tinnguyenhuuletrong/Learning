use actix::prelude::*;

// ----------------- Message

#[derive(Message)]
#[rtype(result = "()")]
struct OrderShipped(usize);

#[derive(Message)]
#[rtype(result = "()")]
struct Ship(usize);

/// Subscribe to order shipped event.
#[derive(Message)]
#[rtype(result = "()")]
struct Subscribe(pub Recipient<OrderShipped>);

// -------------- Actor OrderEvents

/// Actor that provides order shipped event subscriptions
struct OrderEvents {
  subscribers: Vec<Recipient<OrderShipped>>,
}

impl OrderEvents {
  fn new() -> Self {
    OrderEvents {
      subscribers: vec![],
    }
  }
}

impl Actor for OrderEvents {
  type Context = Context<Self>;
}

impl OrderEvents {
  /// Send event to all subscribers
  fn notify(&mut self, order_id: usize) {
    for subscr in &self.subscribers {
      subscr.do_send(OrderShipped(order_id)).unwrap();
    }
  }
}

/// Subscribe to shipment event
impl Handler<Subscribe> for OrderEvents {
  type Result = ();

  fn handle(&mut self, msg: Subscribe, _: &mut Self::Context) {
    self.subscribers.push(msg.0);
  }
}

/// Subscribe to ship message
impl Handler<Ship> for OrderEvents {
  type Result = ();
  fn handle(&mut self, msg: Ship, ctx: &mut Self::Context) -> Self::Result {
    self.notify(msg.0);
    System::current().stop();
  }
}

// -------------- Actor - EmailSubscriber, SmsSubscriber

/// Email Subscriber
struct EmailSubscriber;
impl Actor for EmailSubscriber {
  type Context = Context<Self>;
}

impl Handler<OrderShipped> for EmailSubscriber {
  type Result = ();
  fn handle(&mut self, msg: OrderShipped, _ctx: &mut Self::Context) -> Self::Result {
    println!("Email sent for order {}", msg.0)
  }
}
struct SmsSubscriber;
impl Actor for SmsSubscriber {
  type Context = Context<Self>;
}

impl Handler<OrderShipped> for SmsSubscriber {
  type Result = ();
  fn handle(&mut self, msg: OrderShipped, _ctx: &mut Self::Context) -> Self::Result {
    println!("SMS sent for order {}", msg.0)
  }
}

fn main() {
  let system = actix::System::new();

  system.block_on(async {
    // actor: email_subscriber
    let actor_email = EmailSubscriber {}.start();
    // actor: sms_subscriber
    let actor_sms = SmsSubscriber {}.start();
    // actor: order_event
    let order_event = OrderEvents::new().start();

    // Register sub
    order_event.do_send(Subscribe(actor_email.recipient()));
    order_event.do_send(Subscribe(actor_sms.recipient()));

    // pub event
    order_event.do_send(Ship(1));
  });

  system.run().unwrap();
}
