main() {
  print(createPhoneNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]));
}

String createPhoneNumber(List n) {
  var i = 0;
  final next = () => n[i++];
  return "(${next()}${next()}${next()}) ${next()}${next()}${next()}-${next()}${next()}${next()}${next()}";
}
