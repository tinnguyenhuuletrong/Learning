type Action = Box<dyn Fn()>;
type ActionCtx<T> = Box<dyn Fn(&T)>;


fn invoke(f: Action) {
  f()
}

fn invoke_with_ctx<T>(f: ActionCtx<T>, ins: &T) {
  f(ins)
}


fn say_sorry() {
  println!("sorry")
}

struct Human(String);
impl Human {
  fn say(&self) {
    println!("Human name {}, say hello", self.0)
  }
}

fn main() {
  let echo = Box::new(|| println!("hello"));
  let echo1 = Box::new(say_sorry);
  let h = Human(String::from("TTin"));
  let echo2 = Box::new(Human::say);

  invoke(echo);
  invoke(echo1);
  invoke_with_ctx(echo2, &h);
}