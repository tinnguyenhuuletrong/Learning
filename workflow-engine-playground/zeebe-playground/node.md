# Note

```sh

./zbctl deploy ./test-workflow.bpmn --insecure

./zbctl --insecure  create instance test-workflow

./zbctl --insecure  create worker test-task --handler cat
./zbctl --insecure  create worker test-task2 --handler cat
```

## Ref

https://github.com/zeebe-io/zeebe-docker-compose
https://docs.zeebe.io/getting-started/create-workflow-instance.html
