void main(List<String> args) {
  print(maxNumber("231"));
}

int maxNumber(n) {
  var tmp = n.toString().split('');
  tmp.sort((a, b) => b.compareTo(a));
  return int.parse(tmp.join(''));
}
