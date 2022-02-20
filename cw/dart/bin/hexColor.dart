import 'dart:convert';

void main(List<String> args) {
  print(hexToRGB("#FF9933"));
}

Map<String, int> hexToRGB(String hex) {
  final regex =
      RegExp(r"#(?<r>([A-Z,0-9]){2})(?<g>([A-Z,0-9]){2})(?<b>([A-Z,0-9]){2})");

  final match = regex.firstMatch(hex.toUpperCase());
  if (match == null || match.groupNames.length != 3) return {};

  var r = int.parse(match.namedGroup('r') ?? "0", radix: 16);
  var g = int.parse(match.namedGroup('g') ?? "0", radix: 16);
  var b = int.parse(match.namedGroup('b') ?? "0", radix: 16);

  return {"r": r, "g": g, "b": b};
}
