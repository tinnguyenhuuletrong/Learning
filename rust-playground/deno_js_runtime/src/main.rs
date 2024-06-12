mod ts_loader;

use std::{env, rc::Rc};
use deno_core::{error::AnyError, extension, op2};
use ts_loader::TsModuleLoader;


#[op2(async)]
async fn op_set_timeout(delay: f64) -> Result<(), AnyError> {
    tokio::time::sleep(std::time::Duration::from_millis(delay as u64)).await;
    Ok(())
}

extension! {
    runjs,
    ops = [
        op_set_timeout
    ],
    js = [ "jsRuntime/rt.js",]
}

async fn run_js(file_path: &str) -> Result<(), AnyError> {
    let main_module = deno_core::resolve_path(file_path, env::current_dir()?.as_path())?;
    let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {

        // Default module. support js only
        // module_loader: Some(Rc::new(deno_core::FsModuleLoader)),

        // TS support 
        module_loader: Some(Rc::new(TsModuleLoader)),

        // with snapshot for fast load
        // startup_snapshot: Some(RUNTIME_SNAPSHOT),
        extensions: vec![runjs::init_ops_and_esm()],
        ..Default::default()
    });

    let mod_id = js_runtime.load_main_es_module(&main_module).await?;
    let result = js_runtime.mod_evaluate(mod_id);
    js_runtime.run_event_loop(Default::default()).await?;
    result.await
}

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
