use diesel::SqliteConnection;
use diesel_migrations::{revert_latest_migration, run_pending_migrations};
use dotenv::dotenv;

use planets_service::persistence::connection::create_connection_pool;

pub fn setup() -> Result<SqliteConnection, anyhow::Error> {
    dotenv().ok();
    let pool = create_connection_pool();

    reset_db(&pool);
    run_pending_migrations(&pool)?;

    Ok(pool)
}

fn reset_db(conn: &SqliteConnection) {
    while let Ok(_) = revert_latest_migration(conn) {}
}
