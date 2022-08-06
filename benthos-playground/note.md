# Note

- download from <https://github.com/benthosdev/benthos/releases> -> extract to `/bin`
- <https://www.benthos.dev/docs/guides/getting_started>

```sh
source ./active.sh
```

## Bloblang play

- [doc](https://www.benthos.dev/docs/guides/bloblang/)

- local ide

```sh
benthos blobl server
```

- cmd

```sh
# need remove endline
cat ./bloblang/doc.json | tr -d '\012\015' | benthos blobl -f ./bloblang/hello.blobl
```

## Benthos play 1

- Simple stdIn OR http -> transform ->  syncResponse AND stdout
- list all http-server endpoints by <http://localhost:4195/endpoints>

``` sh
cd play1

benthos create stdin/bloblang/stdout > config.yaml

benthos -c ./config.yaml
```

## Benthos play 2

- Play with cache, branching, children context

``` sh
cd play2
benthos -c ./config.yaml
```
