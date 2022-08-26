mod utils;

use rs_play::*;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, ws-test!");
}

#[wasm_bindgen]
pub fn rs_wasm_bind() -> String {
    "rs_wasm_bind".into()
}

#[wasm_bindgen]
pub fn csv_parse(inp: String) -> String {
    let raw_str = inp.as_str();
    let res = CSVParser::parse(Rule::record, &raw_str);

    match res {
        Ok(it) => it,
        Err(err) => return "".into(),
    }
    .to_json()
    .into()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        assert_eq!(rs_wasm_bind(), "rs_wasm_bind".to_string());
    }
}
