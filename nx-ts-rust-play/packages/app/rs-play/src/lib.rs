pub use pest::Parser;
pub use pest::*;

#[macro_use]
extern crate pest_derive;

#[derive(Parser)]
#[grammar = "grammar.pest"]
pub struct CSVParser;

pub mod math_exp {
    use pest::{
        iterators::{Pair, Pairs},
        prec_climber::*,
    };

    #[derive(Parser)]
    #[grammar = "grammar_math.pest"]
    pub struct MathExpressionParser;

    static TAB: &str = "  ";

    pub fn dump_tree(expression: &Pairs<Rule>, level: Option<usize>) {
        let num_tab = level.unwrap_or(0);
        let iden = TAB.repeat(num_tab);
        for pair in expression.clone() {
            println!("{}Rule: {:?} - {}", iden, pair.as_rule(), pair.as_str());
            dump_tree(&pair.into_inner(), Some(num_tab + 1));
        }
    }

    pub fn eval(expression: Pairs<Rule>) -> f64 {
        let prec_climber: PrecClimber<Rule> = {
            use Assoc::*;
            use Rule::*;

            // Order of operators
            //    + -
            //    * /
            //    ^
            PrecClimber::new(vec![
                Operator::new(add, Left) | Operator::new(subtract, Left),
                Operator::new(multiply, Left) | Operator::new(divide, Left),
                Operator::new(power, Right),
            ])
        };

        prec_climber.climb(
            expression,
            |pair: Pair<Rule>| match pair.as_rule() {
                Rule::num => pair.as_str().parse::<f64>().unwrap(),
                Rule::expr => eval(pair.into_inner()),
                _ => unreachable!(),
            },
            |lhs: f64, op: Pair<Rule>, rhs: f64| match op.as_rule() {
                Rule::add => lhs + rhs,
                Rule::subtract => lhs - rhs,
                Rule::multiply => lhs * rhs,
                Rule::divide => lhs / rhs,
                Rule::power => lhs.powf(rhs),
                _ => unreachable!(),
            },
        )
    }
}
