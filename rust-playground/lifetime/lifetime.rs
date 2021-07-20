fn main() {
  // code_1()
  // code_2()
  // code_3()  ----> compile error
  code_4();
}

// Life time check ok
fn code_1() {
  let str_1 : String = String::from("hello");
  let res = longest(str_1.as_str(), "abc");
  println!("{}", res)
}

// Life time check ok
fn code_2() {
  let str_1 : String = String::from("hello");
  {
    let res = longest(str_1.as_str(), "abc");
    println!("{}", res)  
  }
}

// Life time check will failed. b/c string2 drop when move out of scope
//  -> complie error
// fn code_3() {
//   let string1 = String::from("long string is long");
//   let result;
//   {
//     let string2 = String::from("xyz");
//     result = longest(string1.as_str(), string2.as_str());
//   }
//   println!("The longest string is {}", result);
// }

fn code_4() {
  let string1 = String::from("a");
  let string2 = String::from("b");
  let res = merge(string1.as_str(), string2.as_str());
  println!("{}", res)
}


fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
  if x.len() > y.len() {
    x
  } else {
    y
  }
}

fn merge<'a>(x: &'a str, y: &'a str) -> String {
  let mut result = String::new();
  result.push_str(x);
  result.push_str(y);
  result
}