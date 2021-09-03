mod common;
use planets_service::persistence::{model::PlanetEntity, repo};

#[test]
fn query_get_all() -> Result<(), anyhow::Error> {
    let conn = common::setup()?;
    let res = repo::get_all(&conn)?;

    let expected_res = Vec::from([
        PlanetEntity {
            id: 1,
            name: String::from("Mercury"),
            type_: String::from("TERRESTRIAL_PLANET"),
        },
        PlanetEntity {
            id: 2,
            name: String::from("Venus"),
            type_: String::from("TERRESTRIAL_PLANET"),
        },
        PlanetEntity {
            id: 3,
            name: String::from("Earth"),
            type_: String::from("TERRESTRIAL_PLANET"),
        },
        PlanetEntity {
            id: 4,
            name: String::from("Mars"),
            type_: String::from("TERRESTRIAL_PLANET"),
        },
        PlanetEntity {
            id: 5,
            name: String::from("Jupiter"),
            type_: String::from("GAS_GIANT"),
        },
        PlanetEntity {
            id: 6,
            name: String::from("Saturn"),
            type_: String::from("GAS_GIANT"),
        },
        PlanetEntity {
            id: 7,
            name: String::from("Uranus"),
            type_: String::from("ICE_GIANT"),
        },
        PlanetEntity {
            id: 8,
            name: String::from("Neptune"),
            type_: String::from("ICE_GIANT"),
        },
    ]);

    assert_eq!(res, expected_res);
    Ok(())
}

#[test]
fn query_get_by_id() -> Result<(), anyhow::Error> {
    let conn = common::setup()?;
    let res = repo::get(1, &conn)?;
    println!("{:?}", res);
    assert_eq!(
        res,
        PlanetEntity {
            id: 1,
            name: String::from("Mercury"),
            type_: String::from("TERRESTRIAL_PLANET")
        }
    );
    Ok(())
}
