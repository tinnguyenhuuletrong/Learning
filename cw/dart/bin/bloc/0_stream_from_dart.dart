// ignore: file_names

Stream<int> countStream(int max) async* {
  for (var i = 0; i < max; i++) {
    yield i;
  }
}

Future<int> sumStream(Stream<int> stream) async {
  int sum = 0;
  await for (int item in stream) {
    sum += item;
  }
  return sum;
}

void main(List<String> args) async {
  Stream<int> stream = countStream(100);
  int sum = await sumStream(stream);

  /// Print the sum
  print("Total: $sum"); // 45
}
