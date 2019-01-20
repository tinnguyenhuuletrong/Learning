curl -i -X PUT \
  http://localhost:8098/riak/my_functions/map_capacity \
  -H 'Content-Type: application/json' \
  -d 'function(v) {
    
    /* From the Riak object, pull data and parse it as JSON */
    var parsed_data = JSON.parse(v.values[0].data);
    var data = {};

    /* Key capacity number by room style string */
    data[parsed_data.style] = parsed_data.capacity;
    return [data];
}'

# -> [{"queen":8},{"single":4},{"single":1}]

curl -i -X PUT \
  http://localhost:8098/riak/my_functions/reduce_capacity \
  -H 'Content-Type: application/json' \
  -d 'function(v) {
    var totals = {};
    for (var i in v) {
        for (var style in v[i]) {
            if (totals[style]) totals[style] += v[i][style];
            else totals[style] = v[i][style];
        }
    }
    return [totals];
}'

# [{"queen":8},{"single":5}]
