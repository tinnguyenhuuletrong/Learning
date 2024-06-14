mod ts_loader;
mod runjs_engine;

use std::env;
use runjs_engine::run_js;


fn main() {
    let args = env::args().collect::<Vec<String>>()[1..].to_vec();
    if args.is_empty() {
        // args = vec!["./samples/hello.js".to_string()];
        eprintln!("Usage: runjs <file>");
        std::process::exit(1);
    }
    let file_path = &args[0];

    println!("FilePath: {}", &file_path);

    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .unwrap();

    if let Err(err) = runtime.block_on(run_js(file_path)) {
        eprintln!("Error {err}");
    }
}
