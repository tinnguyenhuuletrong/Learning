#[macro_use]
extern crate diesel;

use actix_web::{web, HttpRequest, Responder};
use persistence::connection::DbPool;

mod persistence;

pub fn create_schema_with_context(pool: DbPool) -> () {
    ()
}

pub fn configure_service(cfg: &mut web::ServiceConfig) {
    // cfg.service(
    //     web::resource("/")
    //         .route(web::post().to(index))
    //         .route(
    //             web::get()
    //                 .guard(guard::Header("upgrade", "websocket"))
    //                 .to(index_ws),
    //         )
    //         .route(web::get().to(index_playground)),
    // );
    cfg.service(web::resource("/about").route(web::get().to(about)));
}

async fn about(_http_req: HttpRequest) -> impl Responder {
    "hello"
}
