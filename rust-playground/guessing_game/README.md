# Note

## Add package

Open `cargo.toml` => add dependencies (semver syntax)

## Open document of all package

cargo doc --open

## Learned

- .expect() => crash + print log

- match {
  case1 => do
  case2 => do
  }

```rs
let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                print!("Invalid number. ");
                continue;
            }
          };
```
