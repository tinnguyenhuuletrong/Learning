mod http;

#[tokio::main]
async fn main() {
    // http::do_get_request().await.unwrap()
    http::do_post_request().await.unwrap()
}
