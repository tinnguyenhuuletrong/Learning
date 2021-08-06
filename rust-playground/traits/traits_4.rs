trait Say {
  fn say(&self) -> String;
}

struct Human;

impl Human {
  fn say(&self) -> String {
    String::from("I am a Human")
  }
}

impl Say for Human {
  fn say(&self) -> String {
    String::from("Say interface. I am a Human")
  }
}


fn main() {
  let a = Human;
  println!("{}", a.say());
  println!("{}", Say::say(&a));
}