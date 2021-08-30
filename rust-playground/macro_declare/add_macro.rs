macro_rules! add {
  ($id: ident, $value: expr ) => { $id += $value; }
}

macro_rules! add_ex {
  // for zero argument
  ($id: ident) => {};

  // for one argument
  ($id: ident, $value: expr ) => { $id += $value; };
  // for multiple argument
  // *: zero or more times.
  ($id: ident, $( $value: expr), * ) => { $( $id += $value; )* };
}

fn main() {
  let mut a: f32 = 1.1;
  let mut b = 5;
  add!(a, 4.0);
  println!("{}", a); // 5.1

  add_ex!(b, 1);
  println!("add_ex 1 {}", &b); 
  add_ex!(b, 1, 2);
  println!("add_ex 2 {}", &b); 
  add_ex!(b);
  println!("add_ex 3 {}", &b); 
}
