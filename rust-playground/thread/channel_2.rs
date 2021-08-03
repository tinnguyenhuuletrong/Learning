use std::thread;
use std::sync::mpsc;

fn main() {

  // capped channel 2
  let (tx, rc) = mpsc::sync_channel(2);
  
  let tx2 = tx.clone();

  // First thread owns sync_sender
  thread::spawn(move || {
    println!("First begin");
    tx.send(1).unwrap();
    tx.send(2).unwrap();
    println!("First end");
  });

  thread::sleep_ms(100);

  // Second thread owns sync_sender2
  thread::spawn(move || {
    println!("Second begin");
    tx2.send(3).unwrap();
    // thread will now block since the buffer is full
    println!("Thread unblocked!");
  });

  thread::sleep_ms(100);

  for elm in rc {
    println!("recieved {}", elm)
  }
}