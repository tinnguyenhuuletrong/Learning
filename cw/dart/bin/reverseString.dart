void main(List<String> args) {
  print(spinWords("Welcome"));
  print(spinWords(("Hey fellow warriors")));
}

String spinWords(String str) {
  return str.split(' ').map((e) {
    if (e.length >= 5) {
      return e.split('').reversed.join('');
    }
    return e;
  }).join(' ');
}
