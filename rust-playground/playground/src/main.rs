mod async_all;

fn main() {
    futures::executor::block_on(async_all::start())
}
