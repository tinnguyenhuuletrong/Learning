use std::fs::File;
use std::io;
use std::io::ErrorKind;
use std::io::Read;

fn main() {

  // unwrap => convert result ok => tyle , result::error => panic
  let content = read_all_lines_from_file("hello.txt").unwrap();
  println!("V1: {}", content);

  // expect => panic with message
  let content = read_all_lines_from_file_v2("hello.txt").expect("Panic! file not found or permission error");
  println!("V2: {}", content);

  let content = read_all_lines_from_file_v3("hello.txt").expect("Panic! file not found or permission error");
  println!("V3: {}", content);

  let content = read_all_lines_from_file_v4("hello.txt").expect("Panic! file not found or permission error");
  println!("V4: {}", content);
}

fn read_all_lines_from_file_v4(path: &str) -> Result<String, io::Error> {
  std::fs::read_to_string(path)
}

fn read_all_lines_from_file_v3(path: &str) -> Result<String, io::Error> {
  let mut s = String::new();

  File::open(path)?.read_to_string(&mut s)?; 
  Ok(s)
}

// A Shortcut for Propagating Errors: the ? Operator
fn read_all_lines_from_file_v2(path: &str) -> Result<String, io::Error> {
  let mut f = File::open(path)?; // auto return error
  let mut s = String::new();
  f.read_to_string(&mut s)?; // auto return error
  Ok(s)
}

fn open_file_with_auto_create(path: &str) -> File {
  let f = File::open(path).unwrap_or_else(|error| {
    if error.kind() == ErrorKind::NotFound {
      // Create file
      File::create("hello.txt").unwrap_or_else(|error| {
          panic!("Problem creating the file: {:?}", error);
      })
    } else {
        panic!("Problem opening the file: {:?}", error);
    }
  });
  f
}

fn read_all_lines_from_file(path: &str) -> Result<String, io::Error> {
  let mut f = open_file_with_auto_create(path);
  let mut s = String::new();

  match f.read_to_string(&mut s) {
      Ok(_) => Ok(s),
      Err(e) => Err(e),
  }
}
