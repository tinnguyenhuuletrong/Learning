use reqwest;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Post {
  id: Option<i32>,
  title: String,
  body: String,
  #[serde(rename = "userId")]
  user_id: i32,
}

pub async fn do_get_request() -> Result<(), reqwest::Error> {
  let body = reqwest::get("https://www.rust-lang.org")
    .await?
    .text()
    .await?;
  println!("body = {:?}", body);
  Ok(())
}

pub async fn do_post_request() -> Result<(), reqwest::Error> {
  let new_post = Post {
    id: None,
    title: "Reqwest.rs".into(),
    body: "https://docs.rs/reqwest".into(),
    user_id: 1,
  };
  let new_post: Post = reqwest::Client::new()
    .post("https://jsonplaceholder.typicode.com/posts")
    .json(&new_post)
    .send()
    .await?
    .json()
    .await?;

  println!("{:#?}", new_post);
  Ok(())
}
