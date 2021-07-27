use console::Style;
use std::error::Error;
use std::fs;

#[derive(Debug, PartialEq)]
pub struct Config {
  search_term: String,
  file_name: String,
}

impl Config {
  pub fn new(args: &[String]) -> Result<Config, &str> {
    if args.len() < 3 {
      return Err("not enough arguments");
    }

    let search_term = args[1].clone();
    let file_name = args[2].clone();

    Ok(Config {
      search_term,
      file_name,
    })
  }
}

pub fn run(config: &Config) -> Result<(), Box<dyn Error>> {
  let content = fs::read_to_string(&config.file_name)?;
  let red = Style::new().red();
  for line in search(&config.search_term, &content) {
    let line_to_print = line.replace(
      &config.search_term,
      &format!("{}", red.apply_to(&config.search_term)),
    );
    println!("{}", line_to_print);
  }

  Ok({})
}

fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
  let mut res: Vec<&str> = Vec::new();
  for line in contents.lines() {
    if line.contains(query) {
      // do something with line
      res.push(line);
    }
  }
  res
}

#[cfg(test)]
mod unit_test {
  use super::*;

  #[test]
  fn parse_arg_success() {
    let args: Vec<String> = vec![
      String::from(""),
      String::from("query"),
      String::from("fileName"),
    ];
    let res = Config::new(&args).unwrap();
    assert_eq!(
      res,
      Config {
        search_term: String::from("query"),
        file_name: String::from("fileName")
      }
    )
  }
  #[test]
  fn parse_arg_failed() {
    let args: Vec<String> = vec![String::from("")];
    let res = Config::new(&args);
    assert_eq!(res, Err("not enough arguments"))
  }

  #[test]
  fn run_success() -> Result<(), Box<dyn Error>> {
    run(&Config {
      file_name: String::from("./sample/dummy.txt"),
      search_term: String::from("d"),
    })
  }

  #[test]
  #[should_panic]
  fn run_file_not_found() {
    run(&Config {
      file_name: String::from("./sample/O_O.txt"),
      search_term: String::from("d"),
    })
    .unwrap()
  }
}
