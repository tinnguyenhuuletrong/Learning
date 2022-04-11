class BudgetItem {
  String name;
  double price;
  DateTime date;
  String tag;

  BudgetItem({
    required this.name,
    required this.price,
    required this.date,
    required this.tag,
  });

  @override
  String toString() {
    return "name:$name, price:$price, date:$date, tag:$tag";
  }

  factory BudgetItem.fromMap(Map<String, dynamic> map) {
    final properties = map["properties"] as Map<String, dynamic>;
    return BudgetItem(
        name: properties["Name"]?["title"][0]?["plain_text"] ?? "",
        price: (properties["Price"]?["number"] ?? 0).toDouble(),
        date: DateTime.parse(properties["Date"]?["date"]?["start"] ?? ""),
        tag: properties["Tags"]?["select"]?["name"] ?? "Any");
  }
}
