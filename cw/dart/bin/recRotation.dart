// https://www.codewars.com/kata/5886e082a836a691340000c3
// Spoiler solution :(

import "dart:math";

int rectangleRotation(int a, int b) {
  final h = a ~/ sqrt2;
  final v = b ~/ sqrt2;
  return h * v + (h + 1) * (v + 1) - (h % 2 ^ v % 2);
}

void main(List<String> args) {
  print(rectangleRotation(6, 4));
}
