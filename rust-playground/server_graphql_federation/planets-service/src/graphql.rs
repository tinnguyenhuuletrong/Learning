use std::collections::HashMap;
use std::str::FromStr;
use std::sync::Arc;

use async_graphql::dataloader::{DataLoader, Loader};
use async_graphql::futures_util::Stream;
use async_graphql::ID;
use async_graphql::*;
use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};

use crate::persistence::connection::{Conn, DbPool};
use crate::persistence::model::{DetailsEntity, NewDetailsEntity, NewPlanetEntity, PlanetEntity};
use crate::persistence::repo;
use crate::{get_conn_from_ctx, get_event_from_ctx};

pub struct Query;
pub struct Mutation;

pub struct Subscription;
pub type AppSchema = Schema<Query, Mutation, Subscription>;

//------------------------------------------------------------------//
//  Query
//------------------------------------------------------------------//

#[Object]
impl Query {
    async fn get_planets(&self, ctx: &Context<'_>) -> Vec<Planet> {
        repo::get_all(&get_conn_from_ctx(ctx))
            .expect("Can't get planets")
            .iter()
            .map(|p| Planet::from(p))
            .collect()
    }

    async fn get_planet(&self, ctx: &Context<'_>, id: ID) -> Option<Planet> {
        find_planet_by_id_internal(ctx, id)
    }

    #[graphql(entity)]
    async fn find_planet_by_id(&self, ctx: &Context<'_>, id: ID) -> Option<Planet> {
        find_planet_by_id_internal(ctx, id)
    }
}

fn find_planet_by_id_internal(ctx: &Context<'_>, id: ID) -> Option<Planet> {
    let id = id
        .to_string()
        .parse::<i32>()
        .expect("Can't get id from String");
    repo::get(id, &get_conn_from_ctx(ctx))
        .ok()
        .map(|p| Planet::from(&p))
}

//------------------------------------------------------------------//
//  Mut
//------------------------------------------------------------------//

#[Object]
impl Mutation {
    async fn create_planet(&self, ctx: &Context<'_>, planet: PlanetInput) -> Result<Planet, Error> {
        let new_planet = NewPlanetEntity {
            name: planet.name,
            type_: planet.type_.to_string(),
        };

        let details = planet.details;
        let new_planet_details = NewDetailsEntity {
            mean_radius: details.mean_radius,
            mass: f64::from_str(&details.mass.to_string()).expect("Can't get f64 from string"),
            population: details.population.map(|wrapper| wrapper),
            planet_id: 0,
        };

        let created_planet_entity =
            repo::create(new_planet, new_planet_details, &get_conn_from_ctx(ctx))?;

        let event_hub = get_event_from_ctx(ctx);
        let message = serde_json::to_value(&Planet::from(&created_planet_entity))?;
        event_hub.send(message)?;

        Ok(Planet::from(&created_planet_entity))
    }
}

//------------------------------------------------------------------//
//  Subscription
//------------------------------------------------------------------//

#[Subscription]
impl Subscription {
    async fn latest_planet<'ctx>(
        &self,
        ctx: &'ctx Context<'_>,
    ) -> impl Stream<Item = Planet> + 'ctx {
        let event_hub = get_event_from_ctx(ctx);
        let recv = event_hub.clone_recevier();

        async_stream::stream! {
             while let value = recv.recv().await {
                yield match value {
                    Ok(message) => serde_json::from_value(message).expect("Can't deserialize a planet"),
                    Err(e) => panic!("Error while Kafka message processing: {}", e),
                };
            }
        }
    }
}

//------------------------------------------------------------------//
//  Type
//------------------------------------------------------------------//

#[derive(Serialize, Deserialize)]
struct Planet {
    id: ID,
    name: String,
    type_: PlanetType,
}

#[Object]
impl Planet {
    async fn id(&self) -> &ID {
        &self.id
    }

    async fn name(&self) -> &String {
        &self.name
    }

    /// From an astronomical point of view
    #[graphql(name = "type")]
    async fn type_(&self) -> &PlanetType {
        &self.type_
    }

    #[graphql(deprecation = "Now it is not in doubt. Do not use this field")]
    async fn is_rotating_around_sun(&self) -> bool {
        true
    }

    async fn details(&self, ctx: &Context<'_>) -> Result<Details> {
        let data_loader = ctx
            .data::<DataLoader<DetailsLoader>>()
            .expect("Can't get data loader");
        let planet_id = self
            .id
            .to_string()
            .parse::<i32>()
            .expect("Can't convert id");
        let details = data_loader.load_one(planet_id).await?;
        details.ok_or_else(|| "Not found".into())
    }
}

#[derive(Copy, Clone, Eq, PartialEq, Serialize, Deserialize, Enum, Display, EnumString)]
#[strum(serialize_all = "SCREAMING_SNAKE_CASE")]
enum PlanetType {
    TerrestrialPlanet,
    GasGiant,
    IceGiant,
    DwarfPlanet,
}

impl From<&PlanetEntity> for Planet {
    fn from(entity: &PlanetEntity) -> Self {
        Planet {
            id: entity.id.into(),
            name: entity.name.clone(),
            type_: PlanetType::from_str(entity.type_.as_str())
                .expect("Can't convert &str to PlanetType"),
        }
    }
}

#[derive(Interface, Clone)]
#[graphql(
    field(name = "id", type = "&i32"),
    field(name = "mean_radius", type = "&f64"),
    field(name = "mass", type = "&f64")
)]
pub enum Details {
    InhabitedPlanetDetails(InhabitedPlanetDetails),
    UninhabitedPlanetDetails(UninhabitedPlanetDetails),
}

#[derive(SimpleObject, Clone)]
pub struct InhabitedPlanetDetails {
    id: i32,
    mean_radius: f64,
    mass: f64,
    /// In billions
    population: Option<f64>,
}

#[derive(SimpleObject, Clone)]
pub struct UninhabitedPlanetDetails {
    id: i32,
    mean_radius: f64,
    mass: f64,
}

impl From<&DetailsEntity> for Details {
    fn from(entity: &DetailsEntity) -> Self {
        if entity.population.is_some() {
            InhabitedPlanetDetails {
                id: entity.id.clone(),
                mean_radius: (entity.mean_radius.clone()) as f64,
                mass: (entity.mass.clone()) as f64,
                population: entity.population.clone(),
            }
            .into()
        } else {
            UninhabitedPlanetDetails {
                id: entity.id.clone(),
                mean_radius: (entity.mean_radius.clone()) as f64,
                mass: (entity.mass.clone()) as f64,
            }
            .into()
        }
    }
}

#[derive(InputObject)]
struct PlanetInput {
    name: String,
    #[graphql(name = "type")]
    type_: PlanetType,
    details: DetailsInput,
}

#[derive(InputObject)]
struct DetailsInput {
    /// In kilometers
    mean_radius: f64,
    /// In kilograms. A number should be represented as, for example, `6.42e+23`
    mass: f64,
    /// In billions
    population: Option<f64>,
}

//------------------------------------------------------------------//
//  Data loader
//------------------------------------------------------------------//

pub struct DetailsLoader {
    pub pool: Arc<DbPool>,
}

#[async_trait::async_trait]
impl Loader<i32> for DetailsLoader {
    type Value = Details;
    type Error = Error;

    async fn load(&self, keys: &[i32]) -> Result<HashMap<i32, Self::Value>, Self::Error> {
        let conn: Conn = self.pool.get().expect("Can't get DB connection");
        let details = repo::get_details(keys, &conn).expect("Can't get planets' details");

        Ok(details
            .iter()
            .map(|details_entity| (details_entity.planet_id, Details::from(details_entity)))
            .collect())
    }
}
