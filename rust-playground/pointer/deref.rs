fn hello(name: &str) {
  println!("Hello, {}!", name);
}

fn main() {
  let val = Box::new(String::from("Rust"));

  // Rust compile 
  //  Deref Box -> String -> Deref &String -> &str
  hello(&val);

  // Equal
  hello(&(*val)[..]);
}