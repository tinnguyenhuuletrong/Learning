fn main() {
  let str = String::from("Hello world");
  let index = first_word_index(&str);
  let world = first_word(&str);

  // Error here. B/c using both &mut and & -> str in same scope
  // str.clear();

  println!("{} - {}", index, world);

  // word should ref to same heap pointer
  assert_eq!(world, &str[0..index]);
}

fn first_word_index(s: &str) -> usize {
  let bytes = s.as_bytes();

  for (i, &item) in bytes.iter().enumerate() {
      if item == b' ' {
          return i;
      }
  }

  s.len()
}


// return a reference to a portion of the String.
fn first_word(s: &str) -> &str {
  let bytes = s.as_bytes();

  for (i, &item) in bytes.iter().enumerate() {
      if item == b' ' {
          return &s[0..i];
      }
  }

  // [0 -> len()]
  &s[..]
}