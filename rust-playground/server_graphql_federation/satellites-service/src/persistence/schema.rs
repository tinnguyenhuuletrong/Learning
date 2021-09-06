table! {
    satellites (id) {
        id -> Integer,
        name -> Text,
        life_exists -> Text,
        first_spacecraft_landing_date -> Nullable<Date>,
        planet_id -> Integer,
    }
}
