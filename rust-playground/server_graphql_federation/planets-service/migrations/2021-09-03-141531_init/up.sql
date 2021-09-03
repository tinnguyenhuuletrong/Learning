-- Your SQL goes here
create table planets (
    id integer primary key autoincrement not null,
    name varchar not null unique,
    type varchar(20) not null
);

create table details (
    id integer primary key autoincrement not null,
    mean_radius numeric(10,1) not null,
    mass numeric(30) not null,
    population numeric(10,2),
    planet_id integer references planets(id) not null
);