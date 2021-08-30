macro_rules! eval {
  ($a: ident <==> $b: ident ) => { 
      let tmp = $a;
      $a = $b;
      $b = tmp;
  };
}

fn main() {
  let (mut a, mut b) = (1, 2);
  println!("a: {}, b: {}", &a, &b);
  eval!(a <==> b);
  println!("a: {}, b: {}", &a, &b);
}