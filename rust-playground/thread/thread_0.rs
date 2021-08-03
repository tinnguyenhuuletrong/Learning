use std::thread;
use std::sync;
use std::time::Duration;

fn main() {
  println!("Main start");
  let mut handlers = vec!();
  
  for i in 1..10 {
    let h = std::thread::spawn(move || {
      thread::sleep(Duration::from_millis(i * 1000));
      println!("Thread done {}", i);
    });

    handlers.push(h);
  }
  

  println!("Main wait");
  for h in handlers {
    h.join();
  }
  println!("Main end");
}