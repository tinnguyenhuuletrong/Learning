use console::Style;
use std::env;
use std::process;

mod lib;
use lib::Config;

fn main() {
    let args: Vec<String> = env::args().collect();
    let config = Config::new(&args).unwrap_or_else(|err| {
        eprintln!("{}", err);
        process::exit(1);
    });
    let cyan = Style::new().cyan();
    println!("{:?}", cyan.apply_to(&config));

    if let Err(e) = lib::run(&config) {
        eprintln!("Error: {}", e);
        process::exit(1);
    }
}
