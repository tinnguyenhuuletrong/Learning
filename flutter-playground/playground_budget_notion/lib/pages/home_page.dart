import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:playground_budget_notion/model/budget_item.dart';
import 'package:intl/intl.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:playground_budget_notion/pages/detail_page.dart';

import '../services/service_notion.dart';

class Controller extends GetxController {
  var items = Future<List<BudgetItem>>.value([]).obs;

  Future<List<BudgetItem>> doRefresh() async {
    final serviceNotion = Get.find<ServiceNotion>();
    items.value = serviceNotion.fetchData();
    return items.value;
  }
}

class Home extends StatelessWidget {
  const Home({Key? key}) : super(key: key);

  @override
  Widget build(context) {
    // Instantiate your class using Get.put() to make it available for all "child" routes there.
    final Controller c = Get.put(Controller());
    c.doRefresh();

    return Scaffold(
      // Use Obx(()=> to update Text() whenever count is changed.
      appBar: AppBar(title: const Text("Notion Budgets")),
      body: Center(child: _BudgetListView()),
      // floatingActionButton: FloatingActionButton(
      //     child: const Icon(Icons.refresh), onPressed: c.doRefresh),
    );
  }
}

class _BudgetListView extends StatelessWidget {
  // You can ask Get to find a Controller that is being used by another page and redirect you to it.
  final Controller controller = Get.find();

  @override
  Widget build(context) {
    // Access the updated count variable
    return Scaffold(
      body: Center(
        child: Obx(
          () => RefreshIndicator(
            onRefresh: () async {
              await controller.doRefresh();
            },
            child: FutureBuilder<List<BudgetItem>>(
              future: controller.items.value,
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Center(child: Text(snapshot.error.toString()));
                } else if (snapshot.hasData) {
                  final items = snapshot.data ?? [];
                  return ListView.builder(
                    itemBuilder: (context, index) {
                      if (index == 0) return _SpendingChart(items: items);

                      final itm = items[index - 1];
                      return _BudgetItem(itm: itm, id: index - 1);
                    },
                    itemCount: items.length + 1,
                  );
                }
                return const Center(child: CircularProgressIndicator());
              },
            ),
          ),
        ),
      ),
    );
  }
}

class _BudgetItem extends StatelessWidget {
  const _BudgetItem({Key? key, required this.itm, required this.id})
      : super(key: key);

  final BudgetItem itm;
  final int id;

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(color: colorByType(itm.tag), width: 2),
            borderRadius: BorderRadius.circular(5),
            boxShadow: const [
              BoxShadow(
                color: Colors.black26,
                offset: Offset(0, 2),
                blurRadius: 6,
              )
            ]),
        padding: const EdgeInsets.all(4),
        margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
        child: ListTile(
          title: Text(itm.name),
          subtitle: Text("${itm.tag} • ${DateFormat.yMd().format(itm.date)}"),
          trailing: Text(
            "-${itm.price}\$",
            style: TextStyle(color: Colors.grey[500]),
          ),
          onTap: () => Get.toNamed("/detail/$id"),
        ));
  }
}

Color colorByType(String type) {
  switch (type.toLowerCase()) {
    case "food":
      return Colors.green.shade600;
    case "personal":
      return Colors.yellow.shade600;
    case "entertainment":
      return Colors.blue.shade600;
    default:
      return Colors.grey;
  }
}

class _SpendingChart extends StatelessWidget {
  final List<BudgetItem> items;
  const _SpendingChart({Key? key, required this.items}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final spendingMap = <String, double>{};
    for (var el in items) {
      spendingMap.update(el.tag, (value) => value + el.price,
          ifAbsent: () => el.price);
    }
    return Card(
      margin: const EdgeInsets.all(8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Container(
        height: 200,
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Expanded(
              child: PieChart(
                PieChartData(
                  sections: spendingMap
                      .map(
                        (key, value) => MapEntry(
                          key,
                          PieChartSectionData(
                              color: colorByType(key),
                              radius: 50,
                              title: "$value\$",
                              value: value,
                              titleStyle: const TextStyle(color: Colors.white),
                              showTitle: false),
                        ),
                      )
                      .values
                      .toList(),
                  sectionsSpace: 0,
                ),
              ),
            ),
            const SizedBox(height: 20.0),
            Wrap(
              spacing: 8.0,
              runSpacing: 8.0,
              children: spendingMap.keys
                  .map((category) => _Indicator(
                        color: colorByType(category),
                        text: category,
                      ))
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}

class _Indicator extends StatelessWidget {
  final Color color;
  final String text;

  const _Indicator({
    Key? key,
    required this.color,
    required this.text,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          height: 16.0,
          width: 16.0,
          color: color,
        ),
        const SizedBox(width: 4.0),
        Text(
          text,
          style: const TextStyle(fontWeight: FontWeight.w500),
        ),
      ],
    );
  }
}
