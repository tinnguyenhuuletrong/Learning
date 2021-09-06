use std::env;

use diesel::r2d2::{ConnectionManager, Pool, PooledConnection};
use diesel::{sqlite::SqliteConnection, Connection};

pub type DbPool = Pool<ConnectionManager<SqliteConnection>>;
pub type Conn = PooledConnection<ConnectionManager<SqliteConnection>>;

pub fn create_connection_pool() -> DbPool {
    let db_url = env::var("DATABASE_URL").expect("Can't get DB URL");
    let manager = ConnectionManager::<SqliteConnection>::new(db_url);
    Pool::builder()
        .build(manager)
        .expect("Failed to create pool")
}
