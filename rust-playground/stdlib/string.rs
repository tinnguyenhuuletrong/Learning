fn main() {
  let a = String::from("Hello");
  let b = String::from("World");
  let c = a + " " + &b;
  println!("{} {}", b, c);

  // Caution
  // Slice string
  let d : &str = &b[0..1];
  println!("{}", d, e);

  // Raised error b/c unicode char size variant
  // thread 'main' panicked at 'byte index 1 is not a char boundary; it is inside 'न' (bytes 0..3) of `नमस्ते`'
  // let e = &"नमस्ते"[0..1];
  // println!("{}", e)
  
  // loop all chars - unicode safe
  for c in "नमस्ते".chars() {
      println!("{}", c);
  }
  
  // loop all bytes - unicode safe
  for b in "नमस्ते".bytes() {
      println!("{}", b);
  }
}