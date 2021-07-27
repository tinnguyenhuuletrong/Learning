fn main() {
  let arr = [1,2,3,4];
  let str_arr = ['a', 'b', 'c', 'd'];
  let do_pow = |x: &i32| -> i32 { x*x };
  let do_inc_one = |x: &i32| { x + 1 };
  let do_upper = |x: &char| { x.to_ascii_uppercase() };
 
  println!("{:?} -> {:?}", arr, do_transform_int(&arr, do_pow));
  println!("{:?} -> {:?}", arr, do_transform_generic(&arr, do_inc_one));
  println!("{:?} -> {:?}", str_arr, do_transform_generic(&str_arr, do_upper))
}

fn do_transform_int(arr: &[i32], process: fn(&i32) -> i32) -> Vec<i32> {
  let mut result: Vec<i32> = Vec::new();
  for elem in arr {
    let new_value :i32 = process(elem);
    result.push(new_value);
  }
  result
}

fn do_transform_generic<T,P>(arr: &[T], process: P) -> Vec<T> 
  where P: Fn(&T) -> T // Fn trail instead of fn ???
{
  let mut result: Vec<T> = Vec::new();
  for elem in arr {
    let new_value :T = process(elem);
    result.push(new_value);
  }
  result
}