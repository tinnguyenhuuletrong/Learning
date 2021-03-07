# dolt playground

## Instalation

https://github.com/dolthub/dolt

## Repo init

```sh
dolt init
dolt config --global --add user.email YOU@DOMAIN.COM
dolt config --global --add user.name "YOUR NAME"

Successfully initialized dolt data repository.
$ dolt sql -q "create table state_populations ( state varchar(14), population int, primary key (state) )"
$ dolt sql -q "show tables"
+-------------------+
| tables            |
+-------------------+
| state_populations |
+-------------------+
$ dolt sql -q "insert into state_populations (state, population) values
('Delaware', 59096),
('Maryland', 319728),
('Tennessee', 35691),
('Virginia', 691937),
('Connecticut', 237946),
('Massachusetts', 378787),
('South Carolina', 249073),
('New Hampshire', 141885),
('Vermont', 85425),
('Georgia', 82548),
('Pennsylvania', 434373),
('Kentucky', 73677),
('New York', 340120),
('New Jersey', 184139),
('North Carolina', 393751),
('Maine', 96540),
('Rhode Island', 68825)"
Query OK, 17 rows affected
```

## Origin files

```sh

mkdir repo
dolt remote add local-file "file:/.."

```

## Commit & push

```sh
dolt add .
dolt commit -m "initial data"
dolt push --set-upstream local-file master
```
