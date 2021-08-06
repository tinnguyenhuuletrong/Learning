trait Power {
  fn power(&self) -> Self;
}

impl Power for i32 {
  fn power(&self) -> i32 {
      self * self
  }
}

fn main() {
  let i : i32 = 10;
  println!("{} ", i.power());
  println!("{} ", 20.power())
}
