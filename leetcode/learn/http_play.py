import urllib.request
import json

req = urllib.request.Request(
    url="https://httpbin.org/anything",
    method="POST",
    headers={"accept": "application/json", "content-type": "application/json"},
    data=json.dumps({"message": "hello there. á à ồ"}).encode("utf-8"),
)
with urllib.request.urlopen(req) as f:
    val = f.read().decode("utf-8")
    print(type(val), "-", val)
