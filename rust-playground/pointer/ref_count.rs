use std::rc::Rc;

fn main() {
  let data = Rc::new("str data");
  let p = Rc::clone(&data);

  println!("1. ref count {}", Rc::strong_count(&data));     // 2
  {
    let p2 = Rc::clone(&data);
    println!("2. ref count {}", Rc::strong_count(&data));   // 3
  }
  println!("3. ref count {}", Rc::strong_count(&data));     // 2

  // manual drop
  drop(p);

  println!("4. ref count {}", Rc::strong_count(&data));     // 1
}