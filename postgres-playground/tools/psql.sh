export CONTAINER_NAME=tools_pg_1
export DB_NAME=dev-db
export ROOT_ACC=dev

docker exec -it $CONTAINER_NAME psql -d $DB_NAME -U $ROOT_ACC