#[cfg(test)]
mod tests {
    use std::borrow::Borrow;

    use pest::Parser;
    use rs_play::*;

    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }

    #[test]
    fn success_field_parse() {
        let inp = "12,-13";
        let res = CSVParser::parse(Rule::field, inp);
        assert_eq!(res.is_ok(), true);

        let v = res.expect("unknow").next().expect("empty");
        assert_eq!(v.as_str(), "12");
    }

    #[test]
    fn error_field_parse() {
        let inp = "a";
        let res = CSVParser::parse(Rule::field, inp);
        assert_eq!(res.is_ok(), false);
    }

    #[test]
    fn success_record_parse() {
        let inp = r#"12,-13"#;

        let res = CSVParser::parse(Rule::record, inp);
        println!("{:?}", res);
        assert_eq!(res.is_ok(), true);

        let arr_val: Vec<&str> = res
            .expect("err")
            .next()
            .unwrap()
            .into_inner()
            .map(|f| f.as_str())
            .collect();

        assert_eq!(arr_val, vec!("12", "-13"));
    }

    #[test]
    fn success_file_parse() {
        let inp = r#"1,2,3
4,5,6
"#;
        let res = CSVParser::parse(Rule::file, inp);
        println!("{:?}", res);
        let tmp = res.unwrap();
        assert_eq!(tmp.as_str(), "1,2,3\n4,5,6\n");
        let first = tmp.into_iter().next();
        assert_eq!(first.unwrap().as_rule(), Rule::file);
    }

    #[test]
    fn success_file_parse_json() {
        let inp = r#"1,2,3
4,5,6
"#;
        let res = CSVParser::parse(Rule::file, inp);
        // println!("{:?}", res);

        let json_str = res.unwrap().to_json();
        println!("{}", json_str);
    }

    #[test]
    fn success_eval_math() {
        let exp =
            math_exp::MathExpressionParser::parse(math_exp::Rule::expr, "(1 + 2^2) * 3)").unwrap();

        math_exp::dump_tree(&exp, Some(0));

        let val = math_exp::eval(exp);
        println!("eval: {}", val);
    }
}
