use neon::prelude::*;
use runjs_engine::run_js;
mod runjs_engine;
mod ts_loader;

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node"))
}

fn exec_runjs(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let file_path: Handle<JsString> = cx.argument(0)?;
    let file_path_str = file_path.value(&mut cx);
    println!("Arg 0: {}", file_path_str);

    let runtime = tokio::runtime::Builder::new_current_thread()
    .enable_all()
    .build()
    .unwrap();

    if let Err(err) = runtime.block_on(run_js(&file_path_str)) {
        eprintln!("Error {err}");
    }

    Ok(cx.undefined())
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("hello", hello)?;
    cx.export_function("exec_runjs", exec_runjs)?;
    Ok(())
}
