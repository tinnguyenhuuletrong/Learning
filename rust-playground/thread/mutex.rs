use std::sync::{Arc, Mutex};

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handlers = vec!();

    for _ in 0..100 {
      let counter_clone = counter.clone();
      let h = std::thread::spawn(move || {
        let mut val = counter_clone.lock().unwrap();
        *val += 1;
      });
      handlers.push(h);
    }

    for elem in handlers {
      elem.join().unwrap();
    }

    println!("Result: {}", counter.lock().unwrap());
}