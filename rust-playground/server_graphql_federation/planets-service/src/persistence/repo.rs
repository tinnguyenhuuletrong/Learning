use diesel::dsl::*;
use diesel::prelude::*;

use crate::persistence::model::{DetailsEntity, NewDetailsEntity, NewPlanetEntity, PlanetEntity};
use crate::persistence::schema::{details, planets};

pub fn get_all(conn: &SqliteConnection) -> QueryResult<Vec<PlanetEntity>> {
    use crate::persistence::schema::planets::dsl::*;

    planets.load(conn)
}

pub fn get(id: i32, conn: &SqliteConnection) -> QueryResult<PlanetEntity> {
    planets::table.find(id).get_result(conn)
}

pub fn get_details(planet_ids: &[i32], conn: &SqliteConnection) -> QueryResult<Vec<DetailsEntity>> {
    details::table
        .filter(details::planet_id.eq_any(planet_ids))
        .load::<DetailsEntity>(conn)
}

pub fn create(
    new_planet: NewPlanetEntity,
    mut new_details_entity: NewDetailsEntity,
    conn: &SqliteConnection,
) -> QueryResult<PlanetEntity> {
    use crate::persistence::schema::{details::dsl::*, planets::dsl::*};

    diesel::insert_into(planets)
        .values(&new_planet)
        .execute(conn)?;

    let created_planet: PlanetEntity = planets.find(sql("last_insert_rowid()")).get_result(conn)?;
    new_details_entity.planet_id = created_planet.id;

    diesel::insert_into(details)
        .values(new_details_entity)
        .execute(conn)?;

    Ok(created_planet)
}
