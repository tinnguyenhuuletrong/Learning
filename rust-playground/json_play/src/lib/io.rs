use std::fs::File;
use std::io::prelude::*;

pub fn write_to_file(path: &str, obj: &json::JsonValue) -> std::io::Result<()> {
  let mut f = File::create(path)?;
  f.write_fmt(format_args!("{}", obj.pretty(2)))?;
  Ok(())
}

pub fn read_from_file(path: &str) -> std::io::Result<String> {
  let mut f = File::open(path)?;
  let mut content = String::new();
  f.read_to_string(&mut content)?;
  Ok(content)
}
