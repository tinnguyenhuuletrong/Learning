#[macro_use]
extern crate diesel;

use std::sync::Arc;

use actix_web::{guard, web, HttpRequest, HttpResponse, Responder, Result};
use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    Context, EmptyMutation, EmptySubscription, Schema,
};
use async_graphql_actix_web::{Request, Response, WSSubscription};
use graphql::{AppSchema, Query};
use persistence::connection::{Conn, DbPool};

mod graphql;
pub mod persistence;

pub fn get_conn_from_ctx(ctx: &Context<'_>) -> Conn {
    ctx.data::<Arc<DbPool>>()
        .expect("Can't get pool")
        .get()
        .expect("Can't get DB connection")
}

pub fn create_schema_with_context(pool: DbPool) -> Schema<Query, EmptyMutation, EmptySubscription> {
    let arc_pool = Arc::new(pool);
    Schema::build(Query, EmptyMutation, EmptySubscription)
        .data(arc_pool)
        .finish()
}

pub fn configure_service(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/")
            .route(web::post().to(index))
            .route(
                web::get()
                    .guard(guard::Header("upgrade", "websocket"))
                    .to(index_ws),
            )
            .route(web::get().to(index_playground)),
    );
    cfg.service(web::resource("/about").route(web::get().to(about)));
}

async fn about(_http_req: HttpRequest) -> impl Responder {
    "hello"
}

async fn index(schema: web::Data<AppSchema>, _http_req: HttpRequest, req: Request) -> Response {
    let mut query = req.into_inner();

    // let maybe_role = common_utils::get_role(http_req);
    // if let Some(role) = maybe_role {
    //     query = query.data(role);
    // }

    schema.execute(query).await.into()
}

async fn index_ws(
    schema: web::Data<AppSchema>,
    req: HttpRequest,
    payload: web::Payload,
) -> Result<HttpResponse> {
    WSSubscription::start(Schema::clone(&*schema), &req, payload)
}

async fn index_playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(
            GraphQLPlaygroundConfig::new("/").subscription_endpoint("/"),
        ))
}
