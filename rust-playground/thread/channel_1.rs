use std::thread;
use std::sync::mpsc;

fn main() {

  let (tx, rc) = mpsc::channel();
  
  for i in 1..4 {
    let tx_clone = tx.clone();
    std::thread::spawn(move || {
      for elem in 1..10 {
        tx_clone.send(elem);
      }
      println!("Done thread {}", i);

      // unref - no need. it auto drop when leave scope - Drop trail
      // drop(tx_clone);
    });
  }

  // Unref 1st one. We don't need it anymore
  drop(tx);

  for elm in rc {
    println!("recieved {}", elm)
  }
}