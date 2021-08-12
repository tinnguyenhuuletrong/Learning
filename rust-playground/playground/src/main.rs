use crypto::digest::Digest;
use crypto::ed25519;
use crypto::sha2::Sha256;

fn main() {
    let seed = sha256("zxc");
    println!("{}", seed.as_bytes().len());
    let (priv_key, pub_key) = ed25519::keypair(&seed.as_bytes()[0..32]);
    println!("{:?}", &priv_key.to_vec());
    println!("{:?}", &pub_key.to_vec());
    let message_test = String::from("hello");
    let message_test = message_test.as_bytes().as_ref();
    let sig = ed25519::signature(message_test, &priv_key);
    println!("sig -> {:?}", &sig);
    let verify = ed25519::verify(message_test, pub_key.as_ref(), sig.as_ref());
    println!("verify -> {:?}", verify);
}

fn sha256(input_str: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.input_str(input_str);

    hasher.result_str()
}
