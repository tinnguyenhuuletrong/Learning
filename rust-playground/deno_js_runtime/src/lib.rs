use neon::prelude::*;
use once_cell::sync::Lazy;
use runjs_engine::run_js;
use tokio::runtime::Runtime;

mod runjs_engine;
mod ts_loader;
static RUNTIME: Lazy<Runtime> = Lazy::new(|| Runtime::new().unwrap());

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node"))
}

fn exec_runjs(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let file_path: Handle<JsString> = cx.argument(0)?;
    let file_path_str = file_path.value(&mut cx);
    println!("Arg 0: {}", file_path_str);

    if let Err(err) = RUNTIME.block_on(run_js(&file_path_str)) {
        eprintln!("Error {err}");
    }

    Ok(cx.undefined())
}

fn exec_runjs_async(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let (deferred, promise) = cx.promise();
    let file_path: Handle<JsString> = cx.argument(0)?;
    let file_path_str = file_path.value(&mut cx);
    println!("Arg 0: {}", file_path_str);

    let channel = cx.channel();

    RUNTIME.spawn_blocking(move || {
        if let Err(err) = RUNTIME.block_on(run_js(&file_path_str)) {
            eprintln!("Error {err}");
        }
        deferred.settle_with(&channel, |mut cx| Ok(cx.boolean(true)));
    });

    Ok(promise)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("hello", hello)?;
    cx.export_function("exec_runjs", exec_runjs)?;
    cx.export_function("exec_runjs_async", exec_runjs_async)?;
    Ok(())
}
