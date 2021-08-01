#[derive(Debug)]
enum List {
  Node(i32, Box<List>),
  Nil
}

impl List {
  fn for_each(&self, process: fn(&i32)) {
    if let Node(val, next) = self {
      process(val);
      next.for_each(process)
    }
  }
}

use crate::List::{Node, Nil};

// Box: Store data in heap instead of stack 
//    Borrow, mut, ref, drop is same behavior
// Recrusive struct => can't allocate fix size in stack
//  Should allocate in heap using box

fn main() {
  let i_value = Box::new(100);
  let tmp = Node(1, 
      Box::new(Node(2, 
        Box::new(Node(3, 
          Box::new(Nil))
        )
      )
    )
  );

  println!("{:?}, {}", tmp, *i_value + 1);
  
  tmp.for_each(|&v| {
    print!("{}->", v)
  });
}