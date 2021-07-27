fn main() {
  let a = Generator::new();
  println!("{:?}", a);

  let arr: Vec<i32> = a.collect();
  println!("{:?}", arr);

  let sum: i32 = Generator::new()
      .zip(Generator::new().skip(1)) // -> [(1, 2), (2, 3), (3, 4), (4, 5)]
      .map(|(a, b)| a * b)           // -> [2, 6, 12, 20]
      .filter(|x| x % 3 == 0)        // -> [6, 12]
      .sum();                        // -> 18
  println!("{:?}", sum)  
}

#[derive(Debug)]
struct Generator {
  value: i32
}

impl Generator {
  fn new() -> Generator {
    Generator{
      value: 0
    }
  }
}

impl Iterator for Generator {
  type Item = i32;

  fn next(&mut self) -> Option<Self::Item> {
      if self.value < 5 {
          self.value += 1;
          Some(self.value)
      } else {
          None
      }
  }
}
