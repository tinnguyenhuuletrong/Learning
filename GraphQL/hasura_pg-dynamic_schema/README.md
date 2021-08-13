## Known issue

1. When db schema update. Should reload metadata from DB

```sh
Data -> DB -> reload
```

2. Add / remove columns. View permission should update

Example

```sh
State1
  id
  sp02
  hpulse

  Public view (id, sp02, hpulse)

State2
  id
  sp02
  => Public view conflict
```
