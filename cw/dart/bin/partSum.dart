void main(List<String> args) {
  print(partsSums([0, 1, 3, 6, 10]));
  print(partsSums([]));
}

List<int> partsSums(List<int> ls) {
  // your code
  var res = <int>[];
  var sum =
      ls.fold<int>(0, (previousValue, element) => previousValue + element);

  res.add(sum);
  for (var i = 0; i < ls.length; i++) {
    sum -= ls[i];
    res.add(sum);
  }

  return res;
}
