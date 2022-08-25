extern crate pest;

use crate::pest::Parser;
use rs_play::*;

fn main() {
    let successful_parse = CSVParser::parse(Rule::field, "-273.15");
    // let field_obj = successful_parse.unwrap().next().unwrap();
    // println!("{:?}", field_obj.as_str().parse::<f32>().unwrap());
    print!("{}", successful_parse.unwrap().to_json())
}
