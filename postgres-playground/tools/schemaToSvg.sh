export CONTAINER_NAME=tools_pg_1
export DB_NAME=dev-db
export ROOT_ACC=dev
BASEDIR=$(dirname "$0")

docker exec -it $CONTAINER_NAME pg_dump $DB_NAME -U $ROOT_ACC --schema-only | python3 ${BASEDIR}/sql_graphviz/sql_graphviz.py | dot -Tsvg > dbSchema.svg