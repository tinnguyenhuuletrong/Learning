fn main() {
  let a = vec![1,2,3,4,5];
  let mut a1 = vec![1,2,3];
  for elem in a.iter() {
    print!("{} ", elem);
  }

  print!("\n");

  // Mul iter
  for elm in a1.iter_mut() {
    *elm += 20
  }
  println!("{:?}", a1);

  // iter -> ref
  let b : Vec<i32> = a.iter().map(|&x| x * 2).collect();
  println!("{:?}", b);

  // into_iter -> takes ownership
  let c : Vec<i32> = a.into_iter().filter(|x| x % 2 == 0).collect();
  println!("{:?}", c);
}