void main(List<String> args) {
  print(factorial(5));
}

int factorial(int n) {
  if (n == 0 || n == 1) return 1;
  return factorial(n - 1) * n;
}
