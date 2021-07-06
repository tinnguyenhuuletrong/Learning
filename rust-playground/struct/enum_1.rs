#[derive(Debug)]
enum Answer {
  Yes,
  No
}

#[derive(Debug)]
enum Message {
  Quit,
  Move { x: i32, y: i32 },
  Write(String),
  ChangeColor(i32, i32, i32),
}

impl Message {
  fn print (&self) {
    println!("Default print. Msg: {:?}", self);
    match self {
      Message::Quit => println!("I am Quit"),
      Message::Move{x, y} => println!("I am Move {} {}", x, y),
      Message::Write(_) => println!("I am Write"),
      Message::ChangeColor(_,_,_) => println!("I am Change color"),
    }
  }
}

fn main() {
  let ans = Answer::Yes;
  println!("{:?}", ans);

  let buffer = [
    Message::Quit,
    Message::Move{
      x: 10, y: 10
    },
    Message::Write(String::from("Hello There")),
    Message::ChangeColor(255,0,0),
  ];

  for (_,it) in buffer.iter().enumerate() {
    it.print();
  }


  // Using options
  let num_op : Option<u8> = std::option::Option::Some(5);
  // let num_op : Option<u8>= std::option::Option::None;
  if num_op.is_some() {
    println!("Option has value {}", num_op.unwrap());
  }
}