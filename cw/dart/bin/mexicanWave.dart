void main(List<String> args) {
  print(wave("hello"));
  print(wave("a       b    "));
}

List<String> wave(String str) {
  // your code here
  var res = <String>[];
  var S = str.split('');
  for (var i = 0; i < S.length; i++) {
    if (S[i] == ' ') continue;
    res.add(str.substring(0, i) + S[i].toUpperCase() + str.substring(i + 1));
  }

  return res;
}
