use std::collections::HashMap;

fn main() {
  let mut scores = HashMap::new();

  scores.insert(String::from("Blue"), 10);
  scores.insert(String::from("Yellow"), 50);

  // Update
  let key = "Blue".to_string();
  let score = 101;
  scores.insert(key, score);

  // Get entry
  println!("get or insert {}", scores.entry(String::from("Red")).or_insert(-1)); 

  println!("{:?}", scores);

  // Loop
  for (key, value) in &scores {
    println!("{}: {}", key, value);
  }

  println!("Word count: {:?}", word_count("i am ttin nice to meet you ttin"));
}

fn word_count(text: &str) -> HashMap<String, i32> {
  let mut map = HashMap::new();
  for word in text.split_whitespace() {
      let count = map.entry(word.to_string()).or_insert(0);
      *count += 1;
  }
  map
}