
struct SmartPointer {
  data: i32
}

impl SmartPointer {
  fn new(val: i32) -> SmartPointer {
    println!("SmartPointer create {}", val);
    SmartPointer{
      data: val
    }
  }
}

impl Drop for SmartPointer {
  fn drop(&mut self) {
    println!("SmartPointer on drop {}", self.data);
  }
}

fn main() {
  let p = SmartPointer::new(0);
  let p1 = SmartPointer::new(1);
  {
    let p2 = SmartPointer::new(2);

    // early drop
    drop(p1);
    
    {
      let p3 = SmartPointer::new(3);
    }
  }
}