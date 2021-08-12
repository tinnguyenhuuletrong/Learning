//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

use webasm_play::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn dummy() {
    assert_eq!(1 + 1, 2);
}

#[wasm_bindgen_test]
fn pass_add() {
    assert_eq!(add(1, 2), 3);
}
