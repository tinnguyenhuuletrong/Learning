import 'package:collection/collection.dart';

void main() {
  const b = ["BBAR 150", "CDXE 515", "BKWR 250", "BTSQ 890", "DRTY 600"];
  const c = ["A", "B", "C", "D"];
  print(stockSummary(b, c));
}

String stockSummary(List<String> lstOfArt, List<String> lstOf1stLetter) {
  if (lstOfArt.isEmpty || lstOf1stLetter.isEmpty) return "";

  final List<int> res = List.filled(lstOf1stLetter.length, 0, growable: false);

  for (var item in lstOfArt) {
    final firstChar = item[0];
    final isInclude = lstOf1stLetter.contains(firstChar);
    if (isInclude) {
      final val = int.tryParse(item.split(' ')[1]) ?? 0;
      final slot = lstOf1stLetter.indexOf(firstChar);
      res[slot] += val;
    }
  }

  final resStr = <String>[];
  for (final pairs in IterableZip([lstOf1stLetter, res])) {
    resStr.add("(${pairs[0]} : ${pairs[1]})");
  }

  return resStr.join(" - ");
}
