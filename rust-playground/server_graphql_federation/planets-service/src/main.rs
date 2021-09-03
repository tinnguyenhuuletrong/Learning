#[macro_use]
extern crate diesel;

use dotenv::dotenv;
mod persistence;

fn main() -> Result<(), anyhow::Error> {
    dotenv().ok();
    let conn = persistence::connection::create_connection_pool();

    let res = persistence::repo::get_all(&conn)?;
    println!("{:#?}", res);
    Ok(())
}
