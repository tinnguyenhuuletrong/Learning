void main(List<String> args) {
  Bool omnibool = Bool(true);
  print(omnibool == false);
  print(true.runtimeType);
}

class Bool {
  dynamic value;

  Bool(bool _value) {
    value = _value;
  }

  bool operator ==(Object val) => true;
}
