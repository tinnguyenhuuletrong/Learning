// ignore_for_file: non_constant_identifier_names

main() {
  print(XO("xxxm"));
}

bool XO(String str) {
  const X = 'x';
  const Y = 'o';
  var numX = 0;
  var numY = 0;
  str = str.toLowerCase();

  for (var i = 0; i < str.length; i++) {
    final charAt = str[i];
    if (charAt == X) {
      numX++;
    } else if (charAt == Y) {
      numY++;
    }
  }
  if (numX == 0 && numY == 0) return true;
  return numX == numY;
}

bool XO_Best(String str) {
  str = str.toLowerCase();
  return 'x'.allMatches(str).length == 'y'.allMatches(str).length;
}
