curl -X POST \
  http://localhost:8098/mapred \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
  "inputs": {
    "bucket":"rooms",
    "key_filters":[["string_to_int"], ["less_than", 1000]]
  },
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