trait Summary {
  fn summarize(&self) -> String;
}

struct NewsArticle {
  pub headline: String,
  pub location: String,
  pub author: String,
  pub content: String,
}

impl Summary for NewsArticle {
  fn summarize(&self) -> String {
      format!("{}, by {} ({})", self.headline, self.author, self.location)
  }
}

struct Tweet {
  pub username: String,
  pub content: String,
  pub reply: bool,
  pub retweet: bool,
}

impl Summary for Tweet {
  fn summarize(&self) -> String {
      format!("{}: {}", self.username, self.content)
  }
}

fn main() {
  let tweet = Tweet {
      username: String::from("horse_ebooks"),
      content: String::from(
          "of course, as you probably already know, people",
      ),
      reply: false,
      retweet: false,
  };

  let new_art = NewsArticle {
    headline: String::from("hot new"),
    location: String::from("NYC"),
    author: String::from("Duck"),
    content: String::from("nothing to see here!"),
  };

  println!("1 new tweet: {}", tweet.summarize());
  println!("1 new article: {}", new_art.summarize());
}