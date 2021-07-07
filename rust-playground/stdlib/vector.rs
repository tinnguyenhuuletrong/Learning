fn main() {
  let mut v1: Vec<i32> = Vec::new();

  for it in 1..10 {
    v1.push(it);
  }
  println!("v1 {:?}", v1);

  let mut v2 = vec!['a','b','c'];
  println!("v2 {:?}", v2);

  // Get at index
  {
    // Get item, with crash
    let res = v2.get(0).expect("OoO");
    println!("v1[0] -> {}", res);

    // Get item, manual check none
    let res = v2.get(10);
    if !res.is_none() {
      println!("v1[10] -> {}", res.unwrap());
    }

    // Get item, ignore none
    if let Some(res) = v2.get(3) {
      println!("v1[3] -> {}", res);
    }

    v2[0] = '9';
  }
  println!("v2 {:?}", v2);

  // It
  {
    let v = vec![100, 32, 57];
    for i in &v {
      println!("{}", i);
    }

    let mut v = vec![100, 32, 57];
    for i in &mut v {
        *i += 50;
    }
    println!("{:?}", v);
  }
}