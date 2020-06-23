# Note

```sh

./zbctl deploy ./test-workflow.bpmn --insecure

./zbctl --insecure  create instance test-workflow

./zbctl --insecure  create worker test-task --handler cat
./zbctl --insecure  create worker test-task2 --handler cat

# ES
http://localhost:9200/zeebe-record*/_search
http://localhost:9200/zeebe-record*/_search?q=value.workflowInstanceKey:2251799813685258&sort=timestamp:desc&size=100
```

## Ref

https://github.com/zeebe-io/zeebe-docker-compose
https://docs.zeebe.io/getting-started/create-workflow-instance.html
