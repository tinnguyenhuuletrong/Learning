-- Your SQL goes here
create table satellites (
    id integer primary key autoincrement not null,
    name varchar not null unique,
    life_exists varchar(20) not null,
    first_spacecraft_landing_date date,
    planet_id integer not null
);