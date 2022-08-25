use std::string;

use neon::prelude::*;

use rs_play::*;

fn csv_parse<'a>(mut cx: FunctionContext) -> JsResult<JsString> {
    let inp = cx.argument::<JsString>(0)?;

    let raw_str = inp.value(&mut cx);
    let res = CSVParser::parse(Rule::record, &raw_str);

    Ok(cx.string(
        match res {
            Ok(it) => it,
            Err(err) => {
                return cx.throw_error(format!("{} {:?}", err.variant.message(), err.location))
            }
        }
        .to_json(),
    ))
}

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node 2022 aug 17 12:22 am"))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("hello", hello)?;
    cx.export_function("csvParse", csv_parse)?;
    Ok(())
}
