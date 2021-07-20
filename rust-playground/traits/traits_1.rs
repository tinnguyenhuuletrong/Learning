trait Summary {
  fn summarize_author(&self) -> String {
    return String::from("unknown")
  }
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

#[derive(std::fmt::Debug)]
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

  fn summarize_author(&self) -> String {
    format!("@{}", self.username)
  }
}

fn notify<T: Summary>(item: &T) {
  println!("Breaking news! {}", item.summarize());
}

fn summary_debug<T>(item: &T) 
  where T: Summary + std::fmt::Debug
{
  println!("Debug {:?}", item);
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

  println!("1 new tweet: {} - {}", tweet.summarize(), tweet.summarize_author());
  println!("1 new article: {} - {}", new_art.summarize(), new_art.summarize_author());

  notify(&tweet);
  notify(&new_art);

  summary_debug(&tweet);

  // NewsArticle: missing implement Debug
  // summary_debug(&new_art);
}