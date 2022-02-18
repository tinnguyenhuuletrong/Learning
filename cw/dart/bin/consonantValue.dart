// https://www.codewars.com/kata/59c633e7dcc4053512000073/train/dart

import 'dart:math';

void main(List<String> args) {
  print(solve("zodiac"));
  print(solve("chruschtschov"));
  print(solve("az"));
}

int solve(String s) {
  final arr = s.split('');
  const CONSONANT_CHAR = ['a', 'e', 'i', 'o', 'u'];

  var maxSum = -1;
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    final c = arr[i];
    if (CONSONANT_CHAR.contains(c)) {
      maxSum = max(maxSum, sum);
      sum = 0;
      continue;
    }
    sum += charToValue(c);
  }
  return max(maxSum, sum);
}

int charToValue(String s) {
  final begin = 'a'.codeUnitAt(0);
  return s.codeUnitAt(0) - begin + 1;
}
