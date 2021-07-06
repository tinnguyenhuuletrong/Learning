fn main() {
  let five = Some(5);
  let six = plus_one(five);
  let none = plus_one(Option::None);

  println!("five {}", five.unwrap());
  println!("six {}", six.unwrap());
  println!("none {}", none.unwrap_or_default());

  let say = match_place_holder(Some(1));
  println!("say {}", say);
  let say = match_place_holder(Some(2));
  println!("say {}", say);
  let say = match_place_holder(Some(3));
  println!("say {}", say);
  let say = match_place_holder(None);
  println!("say {}", say);

  if six == Some(6) {
    println!(" i am  number ! six")
  }
}

fn plus_one(x: Option<i32>) -> Option<i32> {
  match x {
      None => None,
      Some(i) => Some(i + 1),
  }
}

fn match_place_holder(x: Option<i32>) -> String {
  match x {
    Some(1) => String::from("one"),
    Some(2) => String::from("two"),

    // Default
    _ => String::from("unknown")
  }
}