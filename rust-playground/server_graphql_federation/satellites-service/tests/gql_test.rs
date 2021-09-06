mod common;
use actix_web::{test, App};
use common::{GraphQLCustomRequest, GraphQLCustomResponse};
use satellites_service::{configure_service, create_schema_with_context};
use serde_json::Map;

#[actix_rt::test]
async fn graphql_query() -> Result<(), anyhow::Error> {
    let conn = common::setup_ret_pool()?;

    let mut service = test::init_service(
        App::new()
            .configure(configure_service)
            .data(create_schema_with_context(conn)),
    )
    .await;

    let query = "
        query get_by_id {
          getSatellite(id: 1) {
            name
          }  
        }
        "
    .to_string();

    let request_body = GraphQLCustomRequest {
        query,
        variables: Map::new(),
    };

    let request = test::TestRequest::post()
        .uri("/")
        .set_json(&request_body)
        .to_request();

    let response: GraphQLCustomResponse = test::read_response_json(&mut service, request).await;

    assert_eq!(response.errors, None);

    Ok(())
}
