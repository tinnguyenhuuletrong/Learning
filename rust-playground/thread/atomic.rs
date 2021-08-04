use std::sync::atomic::{AtomicI32, Ordering};
use std::sync::Arc;

fn main() {
  let counter = Arc::new(AtomicI32::new(0));
  let mut handlers = vec!();

  for _ in 0..100 {
    let counter = counter.clone();
    let h = std::thread::spawn(move || {
      counter.fetch_add(1, Ordering::SeqCst);
    });
    handlers.push(h);
  }

  for elem in handlers {
    elem.join().unwrap();
  }

  println!("Result: {}", counter.load(Ordering::Relaxed));
}