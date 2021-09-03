use std::env;

use diesel::{Connection, sqlite::SqliteConnection};

pub fn create_connection_pool() -> SqliteConnection {
  let db_url = env::var("DATABASE_URL").expect("Can't get DB URL");
  SqliteConnection::establish(&db_url).unwrap_or_else(|_| panic!("Error connecting to {}", db_url))
}
