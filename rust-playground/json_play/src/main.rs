use chrono::{SecondsFormat, Utc};
use json::object;
use std::fs::File;
use std::io::prelude::*;

fn main() {
    let obj = object! {
        id: "1",
        firstName: "ttin",
        lastName: "nguyen",
        _t: Utc::now().to_rfc3339_opts(SecondsFormat::Millis, true)
    };

    // Content here
    println!("Stringify {}", json::stringify_pretty(obj.clone(), 2));
    // Write to file
    // Handle error noop
    match write_to_file("out.json", &obj) {
        Result::Err(_) => println!("Write file err"),
        _ => println!("write file success"),
    }

    // read again
    // Handle error noop
    let str_content: String = match read_from_file("out.json") {
        Result::Err(_) => "".to_string(),
        Result::Ok(data) => data,
    };

    // Handle error like pro! with .expect
    let obj1: json::JsonValue = json::parse(&str_content).expect("Parse json error");
    println!("Read obj again: {:?}", obj1);
}

fn write_to_file(path: &str, obj: &json::JsonValue) -> std::io::Result<()> {
    let mut f = File::create(path)?;
    f.write_fmt(format_args!("{}", obj.pretty(2)))?;
    Ok(())
}

fn read_from_file(path: &str) -> std::io::Result<String> {
    let mut f = File::open(path)?;
    let mut content = String::new();
    f.read_to_string(&mut content)?;
    Ok(content)
}
