mod common;
use chrono::{Date, NaiveDate};
use satellites_service::persistence::{model::SatelliteEntity, repo};

#[test]
fn query_get_all() -> Result<(), anyhow::Error> {
    let conn = common::setup()?;
    let res = repo::get_all(&conn)?;

    let expected_res = Vec::from([
        SatelliteEntity {
            id: 1,
            name: "Moon".to_string(),
            life_exists: "OPEN_QUESTION".to_string(),
            first_spacecraft_landing_date: Some(
                NaiveDate::parse_from_str("1959-09-13", "%Y-%m-%d").unwrap(),
            ),
            planet_id: 3,
        },
        SatelliteEntity {
            id: 2,
            name: "Phobos".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 4,
        },
        SatelliteEntity {
            id: 3,
            name: "Deimos".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 4,
        },
        SatelliteEntity {
            id: 4,
            name: "Io".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 5,
        },
        SatelliteEntity {
            id: 5,
            name: "Europa".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 5,
        },
        SatelliteEntity {
            id: 6,
            name: "Ganymede".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 5,
        },
        SatelliteEntity {
            id: 7,
            name: "Callisto".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 5,
        },
        SatelliteEntity {
            id: 8,
            name: "Titan".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 6,
        },
        SatelliteEntity {
            id: 9,
            name: "Ariel".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 7,
        },
        SatelliteEntity {
            id: 10,
            name: "Umbriel".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 7,
        },
        SatelliteEntity {
            id: 11,
            name: "Titania".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 7,
        },
        SatelliteEntity {
            id: 12,
            name: "Oberon".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 7,
        },
        SatelliteEntity {
            id: 13,
            name: "Miranda".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 7,
        },
        SatelliteEntity {
            id: 14,
            name: "Triton".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 8,
        },
    ]);

    assert_eq!(res, expected_res);
    Ok(())
}

#[test]
fn query_get_by_planet_id() -> Result<(), anyhow::Error> {
    let conn = common::setup()?;
    let res = repo::get_by_planet_id(4, &conn)?;
    // println!("{:#?}", res);
    let expected_res = Vec::from([
        SatelliteEntity {
            id: 2,
            name: "Phobos".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 4,
        },
        SatelliteEntity {
            id: 3,
            name: "Deimos".to_string(),
            life_exists: "NO_DATA".to_string(),
            first_spacecraft_landing_date: None,
            planet_id: 4,
        },
    ]);
    assert_eq!(res, expected_res);
    Ok(())
}
