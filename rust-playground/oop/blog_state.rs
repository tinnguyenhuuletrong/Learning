pub struct Post {
  state: Option<Box<dyn State>>,
  content: String,
}

impl Post {
  pub fn new() -> Post {
      Post {
          state: Some(Box::new(Draft {})),
          content: String::new(),
      }
  }

  pub fn add_text(&mut self, text: &str) {
    self.content.push_str(text);
  }

  pub fn request_review(&mut self) {
    // state.take(): Takes the value out of the option, leaving a [None] in its place.
    //  Assign state to new value ( output of transition )
    if let Some(s) = self.state.take() {
        self.state = Some(s.request_review())
    }
  }

  pub fn approve(&mut self) {
    if let Some(s) = self.state.take() {
        self.state = Some(s.approve())
    }
  }

  pub fn content(&self) -> &str {
    self.state.as_ref().unwrap().content(self)
  }
}

trait State {
  //  Box<Self> : Only valid when call with  Box<Self>
  fn request_review(self: Box<Self>) -> Box<dyn State>;
  fn approve(self: Box<Self>) -> Box<dyn State>;

  fn content<'a>(&self, _post: &'a Post) -> &'a str {
    ""
  }
}

struct Draft {}
impl State for Draft {
  fn request_review(self: Box<Self>) -> Box<dyn State> {
    Box::new(PendingReview {})
  }

  // Do nothing
  fn approve(self: Box<Self>) -> Box<dyn State> {
    self
  }
}

struct PendingReview {}
impl State for PendingReview {

  // Do nothing
  fn request_review(self: Box<Self>) -> Box<dyn State> {
      self
  }

  // Do nothing
  fn approve(self: Box<Self>) -> Box<dyn State> {
    Box::new(Published {})
  }
}

struct Published {}

impl State for Published {
  // Do nothing
  fn request_review(self: Box<Self>) -> Box<dyn State> {
      self
  }

  // Do nothing
  fn approve(self: Box<Self>) -> Box<dyn State> {
      self
  }

  fn content<'a>(&self, post: &'a Post) -> &'a str {
    &post.content
  }
}


fn main() {
  let mut post = Post::new();

  post.add_text("I ate a salad for lunch today");
  assert_eq!("", post.content());

  post.request_review();
  assert_eq!("", post.content());

  post.approve();
  assert_eq!("I ate a salad for lunch today", post.content());
}