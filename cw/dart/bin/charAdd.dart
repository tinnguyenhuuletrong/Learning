void main(List<String> args) {
  // print(addLetters(['a', 'b'])); // => c
  // print(addLetters(['a', 'b', 'c'])); // => f
  // print(addLetters(['y', 'c', 'b'])); // => d
  print(addLetters(['z'])); // => z
  print(addLetters([])); // => z
}

String addLetters(List<String> letters) {
  final startOffset = 'a'.codeUnitAt(0);
  if (letters.isEmpty) return 'z';

  var tmp = letters.fold<int>(
      0,
      (previousValue, element) =>
          previousValue + (element.codeUnitAt(0) - startOffset + 1));

  tmp = tmp % 26;
  // print('$tmp -> ${String.fromCharCode(tmp + startOffset - 1)}');
  if (tmp == 0) return 'z';
  return String.fromCharCode(tmp + startOffset - 1);
}
