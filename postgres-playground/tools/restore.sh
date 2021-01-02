export CONTAINER_NAME=tools_pg_1
export DB_NAME=dev-db
export ROOT_ACC=dev

if [ -z "$1" ]
then
  echo "Usage: restore.sh <backup_file>.gz"
  exit
fi

gunzip -c $1 | docker exec -i $CONTAINER_NAME psql $DB_NAME -U $ROOT_ACC
