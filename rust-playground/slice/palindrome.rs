
fn is_palindome(str: &str) -> bool {
  let chars : Vec<char> = str.chars().collect();
  do_check(&chars)
}

fn do_check(input: &[char]) -> bool {
  match input {
    [first, middle @ .., last] => first == last && do_check(middle),
    
    // Empty or 1 element -> true
    [] | [_] => true
  }
}

fn main() {
  println!("{}", is_palindome("a"));
  println!("{}", is_palindome("aba"));
  println!("{}", is_palindome("ab"));
}