export CONTAINER_NAME=tools_pg_1
export DB_NAME=dev-db
export ROOT_ACC=dev

docker exec -it $CONTAINER_NAME pg_dump $DB_NAME -U $ROOT_ACC | gzip > $DB_NAME-daily-$(date +%d).gz