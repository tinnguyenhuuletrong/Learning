// mod common;
// use actix_web::{test, App};
// use common::{GraphQLCustomRequest, GraphQLCustomResponse};
// use planets_service::{configure_service, create_schema_with_context};
// use serde_json::Map;

// #[actix_rt::test]
// async fn graphql_query() -> Result<(), anyhow::Error> {
//     let conn = common::setup_ret_pool()?;

//     let mut service = test::init_service(
//         App::new()
//             .configure(configure_service)
//             .data(create_schema_with_context(conn)),
//     )
//     .await;

//     let query = "
//         {
//             getPlanets {
//                 id
//                 name
//                 type
//                 details {
//                     meanRadius
//                     mass
//                     ... on InhabitedPlanetDetails {
//                         population
//                     }
//                 }
//             }
//         }
//         "
//     .to_string();

//     let request_body = GraphQLCustomRequest {
//         query,
//         variables: Map::new(),
//     };

//     let request = test::TestRequest::post()
//         .uri("/")
//         .set_json(&request_body)
//         .to_request();

//     let response: GraphQLCustomResponse = test::read_response_json(&mut service, request).await;

//     Ok(())
// }

// #[actix_rt::test]
// async fn mutation_create_planet() -> Result<(), anyhow::Error> {
//     let conn = common::setup_ret_pool()?;

//     let mut service = test::init_service(
//         App::new()
//             .configure(configure_service)
//             .data(create_schema_with_context(conn)),
//     )
//     .await;

//     let mutation = r#"
//         mutation(
//             $name: String!
//             $type: PlanetType!
//             $meanRadius: Float!
//             $mass: Float!
//             $population: Float!
//         ) {
//             createPlanet(
//                 planet: {
//                     name: $name
//                     type: $type
//                     details: { meanRadius: $meanRadius, mass: $mass, population: $population }
//                 }
//             ) {
//                 id
//                 name
//                 type
//                 details {
//                     meanRadius
//                     mass
//                 }
//             }
//         }
//         "#
//     .to_string();

//     let mut variables = Map::new();
//     variables.insert("name".to_string(), "Test planet".into());
//     variables.insert("type".to_string(), "ICE_GIANT".into());
//     variables.insert("meanRadius".to_string(), 10.7.into());
//     variables.insert("mass".to_string(), 6.4e23.into());
//     variables.insert("population".to_string(), 0.5.into());

//     let request_body = GraphQLCustomRequest {
//         query: mutation,
//         variables,
//     };

//     let request = test::TestRequest::post()
//         .uri("/")
//         .set_json(&request_body)
//         .to_request();

//     let response: GraphQLCustomResponse = test::read_response_json(&mut service, request).await;

//     let response_data = response.data.expect("Response doesn't contain data");
//     println!("{:#?}", response_data);

//     Ok(())
// }
