use diesel::prelude::*;

use diesel::{QueryDsl, QueryResult, RunQueryDsl, SqliteConnection};

use super::model::SatelliteEntity;
use crate::persistence::schema::satellites;

pub fn get_all(conn: &SqliteConnection) -> QueryResult<Vec<SatelliteEntity>> {
    use super::schema::satellites::dsl::*;
    satellites.load(conn)
}

pub fn get(id: i32, conn: &SqliteConnection) -> QueryResult<SatelliteEntity> {
    use super::schema::satellites::dsl::*;
    satellites.find(id).get_result(conn)
}

pub fn get_by_planet_id(
    planet_id: i32,
    conn: &SqliteConnection,
) -> QueryResult<Vec<SatelliteEntity>> {
    satellites::table
        .filter(satellites::planet_id.eq(planet_id))
        .get_results(conn)
}
