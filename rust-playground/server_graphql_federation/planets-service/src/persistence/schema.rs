table! {
    details (id) {
        id -> Integer,
        mean_radius -> Double,
        mass -> Double,
        population -> Nullable<Double>,
        planet_id -> Integer,
    }
}

table! {
    planets (id) {
        id -> Integer,
        name -> Text,
        #[sql_name = "type"]
        type_ -> Text,
    }
}

joinable!(details -> planets (planet_id));

allow_tables_to_appear_in_same_query!(
    details,
    planets,
);
