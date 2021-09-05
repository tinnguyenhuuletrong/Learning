use async_channel::{Receiver, Sender};
use serde_json::json;
use tokio::task;

pub type EventType = serde_json::Value;

pub struct EventHub {
    sender: Sender<EventType>,
    receiver: Receiver<EventType>,
}

impl EventHub {
    pub fn new() -> EventHub {
        let (sender, receiver) = async_channel::unbounded::<EventType>();
        EventHub { sender, receiver }
    }

    pub fn send(&self, msg: EventType) -> Result<(), async_channel::TrySendError<EventType>> {
        self.sender.clone().try_send(msg)
    }

    pub fn clone_recevier(&self) -> Receiver<EventType> {
        self.receiver.clone()
    }
}

#[actix_rt::test]
async fn event_hub() {
    let hub = super::event_hub::EventHub::new();
    let recv = hub.clone_recevier();
    let handler = task::spawn(async move {
        let res = recv.recv().await.expect("error");
        assert_eq!(*res.get("type").unwrap(), json!("msg"));
    });
    let value = json! ({
        "type": "msg"
    });
    hub.send(value);
    handler.await;
}
