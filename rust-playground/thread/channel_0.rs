use std::thread;
use std::sync::mpsc;

fn main() {

  let (tx, rc) = mpsc::channel();
  
  std::thread::spawn(move || {
    for elem in 1..100 {
      tx.send(elem);
    }
    println!("Done thread");
    drop(tx);
  });

  for elm in rc {
    println!("recieved {}", elm)
  }
}