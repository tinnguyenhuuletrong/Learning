trait Shape {
  fn area(&self) -> f32;
}

struct Rectangle {
  width: f32,
  height: f32
}

impl Shape for Rectangle {
  fn area(&self) -> f32 {
    return self.width * self.height
  }
}

struct Circle {
  radius: f32
}

impl Shape for Circle {
  fn area(&self) -> f32 {
    return self.radius * self.radius * std::f32::consts::PI;
  }
}

struct Board {
  selected: Option<usize>,
  items: Vec<Box<dyn Shape>>
}

fn main() {
  let mut board = Board{
    selected: Option::None,
    items: vec![
      Box::new(Rectangle{ width: 10.0, height: 5.0 }), 
      Box::new(Circle{ radius: 5.0})
    ]
  };
  board.selected = Some(0);
  
  println!("list:");
  for elem in &board.items {
    println!("\t{}", elem.area());
  }
  let index = board.selected.unwrap();
  println!("selected: {}", board.items[index].area());
}