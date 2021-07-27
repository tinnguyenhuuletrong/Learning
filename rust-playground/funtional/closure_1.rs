fn main() {
  let mut do_inc = inc();
  println!("{} ", do_inc());
  println!("{} ", do_inc());
  println!("{} ", do_inc());
  println!("{} ", do_inc());
}

fn inc() -> impl FnMut() -> u32 {
  let mut val = 0;
  move || {
    val = val + 1;
    val
  }
}