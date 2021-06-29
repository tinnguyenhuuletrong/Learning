# Redis worker queue

## How to run

```sh
yarn run start-docker

# Terminal 1
node worker_pool

# Terminal 2
node add_job
```

## Result

- 5 worker thread
  rps: 1520 items (1 worker thread / 304 items / s)

```sh
work: 26.326ms filled 50000 items
work: 32886.005ms
```

- 10 worker thread
  rps = 1928 (1 worker thread / 192 items / s)

```sh
work: 28.515ms filled 50000 items
work: 25931.373ms
```

- 1 worker thread
  rps = 440

```sh
work: 19.794ms filled 50000 items
work: 113484.200ms
```
