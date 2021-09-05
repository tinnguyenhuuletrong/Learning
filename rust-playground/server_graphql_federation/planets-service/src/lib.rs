use std::sync::Arc;

use crate::graphql::{AppSchema, DetailsLoader, Mutation, Query};
use actix_web::{guard, web, HttpRequest, HttpResponse, Responder, Result};
use async_graphql::{
    dataloader::DataLoader,
    http::{playground_source, GraphQLPlaygroundConfig},
    Context, EmptySubscription, Schema,
};
use async_graphql_actix_web::{Request, Response, WSSubscription};
use event_hub::EventHub;
use graphql::Subscription;
use persistence::connection::{Conn, DbPool};

#[macro_use]
extern crate diesel;
mod event_hub;
mod graphql;
pub mod persistence;

pub fn get_conn_from_ctx(ctx: &Context<'_>) -> Conn {
    ctx.data::<Arc<DbPool>>()
        .expect("Can't get pool")
        .get()
        .expect("Can't get DB connection")
}

pub fn get_event_from_ctx<'a>(ctx: &'a Context<'_>) -> &'a EventHub {
    ctx.data::<Arc<EventHub>>()
        .expect("Can't get Event")
        .as_ref()
}

pub fn create_schema_with_context(pool: DbPool) -> Schema<Query, Mutation, Subscription> {
    let arc_pool = Arc::new(pool);
    let cloned_pool = Arc::clone(&arc_pool);
    let details_data_loader =
        DataLoader::new(DetailsLoader { pool: cloned_pool }).max_batch_size(10);
    let arc_event_hub = Arc::new(EventHub::new());

    // let kafka_consumer_counter = Mutex::new(0);

    Schema::build(Query, Mutation, Subscription)
        // limits are commented out, because otherwise introspection query won't work
        .data(arc_pool)
        .data(details_data_loader)
        .data(arc_event_hub)
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
