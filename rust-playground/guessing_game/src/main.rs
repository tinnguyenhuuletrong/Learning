use rand::Rng;
use std::cmp::Ordering;
use std::io;

const RANGE: std::ops::Range<u32> = 1..200;

fn main() {
    let secret_number = rand::thread_rng().gen_range(RANGE);

    // println!("The secret number is: {}", secret_number);
    println!("Guess the number in range {}-{} !", RANGE.start, RANGE.end);

    loop {
        println!("Please input your guess.");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess) // Result object - union OK or Error
            .expect("Failed to read line"); // io::Result.expect Should handle error case - avoid warining

        // Shadowing Variable
        // lets us reuse the guess variable name rather than forcing us to create two unique variables, such as guess_str and guess
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                print!("Invalid number. ");
                continue;
            }
        };

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}
