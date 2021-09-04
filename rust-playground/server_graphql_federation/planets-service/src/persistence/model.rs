use crate::persistence::schema::{details, planets};

#[derive(Debug, Identifiable, Queryable, PartialEq)]
#[table_name = "planets"]
pub struct PlanetEntity {
    pub id: i32,
    pub name: String,
    pub type_: String,
}

#[derive(Debug, Identifiable, Queryable, Associations, PartialEq)]
#[table_name = "details"]
#[belongs_to(PlanetEntity, foreign_key = "planet_id")]
// TODO: store in 2 different tables (impl inheritance)
pub struct DetailsEntity {
    pub id: i32,
    pub mean_radius: f64,
    pub mass: f64,
    pub population: Option<f64>,
    pub planet_id: i32,
}

#[derive(Debug, Insertable)]
#[table_name = "planets"]
pub struct NewPlanetEntity {
    pub name: String,
    pub type_: String,
}

#[derive(Debug, Insertable)]
#[table_name = "details"]
pub struct NewDetailsEntity {
    pub mean_radius: f64,
    pub mass: f64,
    pub population: Option<f64>,
    pub planet_id: i32,
}
