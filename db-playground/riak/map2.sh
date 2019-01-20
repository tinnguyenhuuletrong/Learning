curl -X POST \
  http://localhost:8098/mapred \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
  "inputs": "rooms",
  "query": [
    {
      "map": {
        "language": "javascript",
        "bucket":"my_functions",
        "key":"map_capacity"
      }
    },
    {
      "reduce": {
        "language": "javascript",
        "bucket":"my_functions",
        "key":"reduce_capacity"
      }
    }
  ]
}'