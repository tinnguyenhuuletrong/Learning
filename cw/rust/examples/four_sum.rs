// https://medium.com/@michealkeines/four-number-sum-rust-ed1ae5f1e708

use std::collections::HashMap;

fn main() {
    let input = vec![-2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let target_four_sum = 4;

    let res = find(&input, &target_four_sum);

    println!("Input {:?}", &input);
    println!("Target {:?}", &target_four_sum);
    println!("Combine {:?}", &res);
}

fn find(arr: &Vec<i32>, target_sum: &i32) -> Vec<Vec<i32>> {
    let mut res: Vec<Vec<i32>> = vec![];
    let mut hash: HashMap<i32, Vec<Vec<i32>>> = HashMap::new();

    for i in 0..arr.len() {
        let current_val = arr[i];

        // Forward check: Find remainer
        for j in i + 1..arr.len() {
            let tmp_sum = current_val + arr[j];
            let remainer = target_sum - tmp_sum;

            if hash.contains_key(&remainer) {
                let entry = hash.get(&remainer).unwrap();
                for it in 0..entry.len() {
                    res.push(vec![current_val, arr[j], entry[it][0], entry[it][1]])
                }
            }
        }

        // Backward add pair sum to list
        for k in 0..i {
            let tmp_sum = current_val + arr[k];
            let entry = hash.entry(tmp_sum).or_insert(Vec::new());
            entry.push(vec![current_val, arr[k]]);
        }
    }
    res
}
