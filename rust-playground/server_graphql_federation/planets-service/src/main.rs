#[macro_use]
extern crate diesel;

use actix_web::{App, HttpServer};
use dotenv::dotenv;
use planets_service::{configure_service, create_schema_with_context};
mod persistence;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let pool = persistence::connection::create_connection_pool();

    let schema = create_schema_with_context(pool);

    HttpServer::new(move || App::new().configure(configure_service).data(schema.clone()))
        .bind("0.0.0.0:8001")?
        .run()
        .await?;

    Ok(())
}
