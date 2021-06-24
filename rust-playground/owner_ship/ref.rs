fn main() {
  let s1 = String::from("hello");
  let mut s2 = String::from("hello");

  let len = calculate_length(&s1);
  println!("{} {}", s1, len);

  change(&mut s2);
  println!("{}", s2);

  // you can have only one mutable reference to a particular piece of data in a particular scope
  // Compile error
  // let s3 = &mut s2;
  // let s4 = &mut s2;
  // println!("{} {}", s3, s4);

  // Compiler is smart !
  //  If not posibble race condition (read + write share same time ) => let you pass
  //    The scopes of the immutable references r1 and r2 end after the println! where they are last used, which is before the mutable reference r3 is created. 
  //    These scopes don’t overlap, so this code is allowed.
  {
    let mut s = String::from("hello");

    let r1 = &s; // no problem
    let r2 = &s; // no problem
    println!("{} and {}", r1, r2);
    // r1 and r2 are no longer used after this point

    let r3 = &mut s; // no problem
    println!("{}", r3);
  }

  // dangle(dead) ref
  // Reference to deleted ref
  {

    // let s = dangle();
    let s = not_dangle();
    println!("{}", s);
  }

}

// s is a reference to a String. Not borrow
fn calculate_length(s: &String) -> usize {
  s.len()
} // Here, s goes out of scope. But because it does not have ownership of what
// it refers to, nothing happens.

// some_string is = (mut mutable reference)
fn change(some_string: &mut String) {
  some_string.push_str(", world");
}

/*
fn dangle() -> &String {
  let s = String::from("hello");
  &s
} // we return a reference to the String, s
// Here, s goes out of scope, and is dropped. Its memory goes away.
*/

fn not_dangle() -> String {
  let s = String::from("hello");
  s
}