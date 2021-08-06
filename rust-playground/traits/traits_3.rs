use std::ops::Add;
use std::clone::Clone;
use std::fmt;

#[derive(Debug, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Point;

    fn add(self, other: Point) -> Point {
        Point {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}
impl Clone for Point {
  fn clone(&self) -> Self {
    Point {
      x: self.x,
      y: self.y
    }
  }

}

struct Millimeters(u32);
struct Meters(u32);

// new Rhs
// mm + m -> mm
impl Add<Meters> for Millimeters {
    type Output = Millimeters;

    fn add(self, other: Meters) -> Millimeters {
        Millimeters(self.0 + (other.0 * 1000))
    }
}

impl Add<Millimeters> for Meters {
  type Output = Meters;

  fn add(self, other: Millimeters) -> Meters {
    Meters(self.0 + (other.0 / 1000))
  }
}
impl fmt::Display for Meters {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
      write!(f, "{}m", self.0)
  }
}
impl fmt::Display for Millimeters {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
      write!(f, "{}mm", self.0)
  }
}

fn main() {
  let a = Point { x: 1, y: 0 };
  let b = Point { x: 2, y: 3 };
  let c = Point { x: 1, y: 0 } + Point { x: 2, y: 3 };
  println!("{:?} + {:?} = {:?}", a.clone(), b.clone(), a + b);

  println!("{} + {} = {}", Millimeters(10), Meters(9), Millimeters(10) + Meters(9));
  println!("{} + {} = {}", Millimeters(10), Meters(9), Meters(9) + Millimeters(10));
}