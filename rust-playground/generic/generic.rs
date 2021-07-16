fn largest<T>(list: &[T]) -> T 
  where T : std::cmp::PartialOrd + std::marker::Copy
{
  let mut largest = list[0];

  for &item in list {
      if item > largest {
          largest = item;
      }
  }

  largest
}

// Compiler will generate runtime_type for each T
#[derive(Debug, Copy, Clone, PartialEq)]
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> 
  where T : Copy + std::ops::Mul<Output = T> + std::ops::Add<Output = T>, f64: From<T>
{
  fn length(&self) -> f64 {
    let res = self.x * self.x + self.y * self.y;
    
    f64::from(res).sqrt()
  }
}

// Only available for T: f32
impl Point<f32> {
  fn distance_from_origin(&self) -> f32 {
      (self.x.powi(2) + self.y.powi(2)).sqrt()
  }
}

fn main() {
  let number_list = vec![34, 50, 25, 100, 65];

  let result = largest(&number_list);
  println!("The largest number is {}", result);

  let char_list = vec!['y', 'm', 'a', 'q', 'á'];

  let result = largest(&char_list);
  println!("The largest char is {}", result);


  let str_list = vec!["Tin", "An", "Toan"];
  let result = largest(&str_list);
  println!("The largest string is {}", result);

  let p = Point {x: 10, y: 10};
  println!("{:?} -> length: {}", p, p.length());

  let p = Point {x: 0, y: 1};
  println!("{:?} -> length: {}", p, p.length());

  let p = Point {x: 2.0, y: 1.0};
  println!("{:?} -> distance_from_origin: {}, length: {}", p, p.distance_from_origin(), p.length());

}