fn counter () -> Box<dyn FnMut() -> i32> {
  let mut count = 0;
  Box::new(move || {
    count += 1;
    println!("Count {}", count);
    count
  })
}


fn main() {
  let mut h;
  {
    h = counter();
  }
  println!("{} {} {}", h(), h(), h())
}