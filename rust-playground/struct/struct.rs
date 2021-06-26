#[derive(Debug)]
struct Rectangle {
  width: i32,
  height: i32
}

impl Rectangle {
  fn area(&self) -> i32 {
    self.width * self.height
  }

  fn can_hold(&self, other: &Rectangle) -> bool {
    self.width > other.width && self.height > other.height
  }
}

impl Rectangle {
  fn square(size: i32) -> Rectangle {
    Rectangle {
      width: size,
      height: size
    }
  }
}

fn main() {
  let rec = Rectangle {
    width: 10,
    height: 20
  };

  let rec2 = Rectangle {
    height: 60,
    ..rec
  };

  let rec3 = Rectangle::square(2);
  
  println!("{:?} -> area: {}", rec, rec.area());
  println!("{:?} -> area: {}", rec2, rec2.area());
  println!("{:?} -> area: {}", rec3, rec3.area());

  println!("rec can hold rec2 ? -> {}", rec.can_hold(&rec2));
  println!("rec can hold rec3 ? -> {}", rec.can_hold(&rec3));
  
}