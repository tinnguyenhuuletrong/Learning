fn main() {
  let s = String::from("hello");  // s comes into scope

  takes_ownership(s);             // s's value moves into the function...
                                  // ... and so is no longer valid here


  // Compile error. s no longer valid here
  // let s1 = s;

  let x = 5;                      // x comes into scope

  makes_copy(x);                  // x would move into the function,
                                  // but i32 is Copy, so it's okay to still
                                  // use x afterward
                                  // ----------------------------
                                  // All the integer types, such as u32.
                                  // The Boolean type, bool, with values true and false.
                                  // All the floating point types, such as f64.
                                  // The character type, char.
                                  // Tuples, if they only contain types that also implement Copy. For example, (i32, i32) implements Copy, but (i32, String) does not.

} // Here, x goes out of scope, then s. But because s's value was moved, nothing
// special happens.

fn takes_ownership(some_string: String) { // some_string comes into scope
  println!("fn takes_ownership - (Here, some_string goes out of scope and `drop` is called. The backing) - {}", some_string);
} // Here, some_string goes out of scope and `drop` is called. The backing
// memory is freed.

fn makes_copy(some_integer: i32) { // some_integer comes into scope
  println!("fn makes_copy Here, some_integer goes out of scope. Nothing special happens. {}", some_integer);
} // Here, some_integer goes out of scope. Nothing special happens.