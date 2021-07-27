fn main() {
  let buffer = Vec::from([1,2,3,4,5,6]);
  let mut out_buffer = Vec::new();
  let mask = [-1, 0, 1];
  let stride = (mask.len() - 1) / 2;

  out_buffer.extend_from_slice(&buffer[0..stride]);
  // Conv by mask
  for i in stride..buffer.len()-stride {
    let sum :i32 = mask.iter()
                .zip(&buffer[i-stride..i+stride])
                .map(|(a,b)| a*b)
                .sum();

    out_buffer.push(sum);
  }
  out_buffer.extend_from_slice(&buffer[buffer.len()-stride..buffer.len()]);
  println!("{:?}", out_buffer)
}