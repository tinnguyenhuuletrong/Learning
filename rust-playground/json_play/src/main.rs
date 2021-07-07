use json_play::fake_person as alias_fake_function_name;

fn main() {
    let obj = json_play::fake_person();
    let obj2 = alias_fake_function_name();

    // Content here
    println!("Stringify {}", json::stringify_pretty(obj.clone(), 2));
    println!("Stringify {}", json::stringify_pretty(obj2, 2));
    // Write to file
    // Handle error noop
    match json_play::io::write_to_file("out.json", &obj) {
        Result::Err(_) => println!("Write file err"),
        _ => println!("write file success"),
    }

    // read again
    // Handle result or error noop
    let str_content: String = match json_play::io::read_from_file("out.json") {
        Result::Err(_) => "".to_string(),
        Result::Ok(data) => data,
    };

    // Handle error like pro! with .expect
    let obj1: json::JsonValue = json::parse(&str_content).expect("Parse json error");
    println!("Read obj again: {:?}", obj1);
}
