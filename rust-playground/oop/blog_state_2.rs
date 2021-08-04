pub struct Post {
  content: String,
}

pub struct DraftPost {
  content: String,
}

pub struct PendingReviewPost {
  content: String,
}

pub struct PublishedPost {
  content: String,
}

impl Post {
  pub fn new() -> DraftPost {
      DraftPost {
          content: String::new(),
      }
  }

  pub fn content(&self) -> &str {
      &self.content
  }
}

impl DraftPost {
  pub fn add_text(&mut self, text: &str) {
      self.content.push_str(text);
  }

  pub fn content(&self) -> &str {
    ""
  }

  pub fn request_review(&self) -> PendingReviewPost {
    PendingReviewPost {
      content: self.content.clone()
    }
  }
}

impl PendingReviewPost {
  pub fn content(&self) -> &str {
    ""
  }

  pub fn approve(&self) -> PublishedPost {
    PublishedPost {
      content: self.content.clone(),
    }
  }
}

impl PublishedPost {
  pub fn content(&self) -> &str {
    self.content.as_ref()
  }
}

fn main() {
  let mut post = Post::new();

  post.add_text("I ate a salad for lunch today");
  assert_eq!("", post.content());

  let post = post.request_review();
  assert_eq!("", post.content());

  let post = post.approve();
  assert_eq!("I ate a salad for lunch today", post.content());
}