mod utils;

use crypto::digest::Digest;
use crypto::ed25519;
use crypto::sha2::Sha256;
use crypto::sha3::Sha3;
use std::fmt::Write;
use wasm_bindgen::prelude::*;

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

fn seed_to_32_bytes(input_str: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.input_str(input_str);

    hasher.result_str()[0..32].to_string()
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, webasm-play!");
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn sha3_keccak512(input: String) -> String {
    let mut hasher = Sha3::keccak512();
    hasher.input_str(&input);
    hasher.result_str().to_string()
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct KeyPair {
    priv_key: String,
    pub_key: String,
}

#[wasm_bindgen]
impl KeyPair {
    pub fn get_pub_key(&self) -> String {
        self.pub_key.clone()
    }

    pub fn get_priv_key(&self) -> String {
        self.priv_key.clone()
    }
}

#[wasm_bindgen]
pub fn ed25519_keygen(seed: String) -> KeyPair {
    let seed_32_bytes = seed_to_32_bytes(&seed);

    let (priv_key, pub_key) = ed25519::keypair(seed_32_bytes.as_bytes());
    let res = KeyPair {
        priv_key: hex::encode(&priv_key),
        pub_key: hex::encode(&pub_key),
    };
    // console_log!("{:?}\n{:?}", &priv_key, &pub_key);
    res
}

#[wasm_bindgen]
pub fn ed25519_sign(message: String, priv_key_hex: String) -> String {
    let buff = hex::decode(&priv_key_hex).unwrap();
    let res = ed25519::signature(&message.as_bytes(), &buff);
    hex::encode(res)
}

#[wasm_bindgen]
pub fn ed25519_verify(message: String, sig_hex: String, pub_key_hex: String) -> bool {
    let buff = hex::decode(&pub_key_hex).unwrap();
    let buff_sig = hex::decode(&sig_hex).unwrap_or(Vec::new());
    if buff_sig.len() != 64 {
        return false;
    }
    let res = ed25519::verify(message.as_bytes(), &buff, &buff_sig);
    res
}
