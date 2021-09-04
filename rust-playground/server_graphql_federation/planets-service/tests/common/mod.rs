use diesel::SqliteConnection;
use diesel_migrations::{revert_latest_migration, run_pending_migrations};
use dotenv::dotenv;

use planets_service::persistence::connection::{create_connection_pool, Conn, DbPool};
use serde::{Deserialize, Serialize};
use serde_json::Map;

pub fn setup() -> Result<Conn, anyhow::Error> {
    dotenv().ok();
    let pool = create_connection_pool().get().unwrap();

    reset_db(&pool);
    run_pending_migrations(&pool)?;

    Ok(pool)
}

pub fn setup_ret_pool() -> Result<DbPool, anyhow::Error> {
    dotenv().ok();
    let pool = create_connection_pool();
    let conn = pool.get().unwrap();

    reset_db(&conn);
    run_pending_migrations(&conn)?;

    Ok(pool)
}

fn reset_db(conn: &SqliteConnection) {
    while let Ok(_) = revert_latest_migration(conn) {}
}

#[derive(Debug, Serialize)]
pub struct GraphQLCustomRequest {
    pub query: String,
    pub variables: Map<String, serde_json::Value>,
}

#[derive(Debug, Deserialize)]
pub struct GraphQLCustomResponse {
    pub data: Option<serde_json::Value>,
    pub errors: Option<serde_json::Value>,
}
