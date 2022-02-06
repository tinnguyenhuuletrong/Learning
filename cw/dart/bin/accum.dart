void main() {
  print(accum("ZpglnRxqenU"));
}

String accum(String str) {
  var idx = 1;
  var tmp = str.toLowerCase().split('').map((e) {
    var itm = (e * idx++);
    return itm[0].toUpperCase() + itm.substring(1);
  });
  return tmp.join('-');
}
