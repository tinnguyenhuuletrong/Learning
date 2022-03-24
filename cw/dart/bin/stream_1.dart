void main(List<String> args) async {
  // Stream.periodic
  //    interval 1 sec--> emit i (begin from 0)
  //  | pipe--> take(5) // get 5 then terminate

  final stream = Stream.periodic(Duration(seconds: 1), (x) => x).take(5);
  await for (var item in stream) {
    print(item);
  }
}
