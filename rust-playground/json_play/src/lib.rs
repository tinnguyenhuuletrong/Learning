// json_play - crate name

// Subname json_play::lib
pub mod lib {

  use chrono::{SecondsFormat, Utc};
  use json;
  use json::object;

  // External module in /lib/io.rs
  pub mod io;
  pub fn fake_person() -> json::JsonValue {
    object! {
      firstName: "aaa",
      lastName: "bbb",
      _t: Utc::now().to_rfc3339_opts(SecondsFormat::Millis, true)
    }
  }
}

// Shortcut
//  Map json_play::lib -> json_play::
//  json_play::lib::fake_person <-> json_play::fake_person
pub use lib::{fake_person, io};

// Export all
// pub use lib::*;
