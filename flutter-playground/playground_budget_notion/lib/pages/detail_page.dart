import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../services/service_notion.dart';

class DetailPage extends StatelessWidget {
  const DetailPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final id = Get.parameters["id"] ?? "";
    final serviceNotion = Get.find<ServiceNotion>();
    final data = serviceNotion.allItems[int.parse(id)];

    return Scaffold(
      appBar: AppBar(title: Text("Detail page $id")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(data.name),
            Text(data.date.toString()),
            Text("\$${data.price.toString()}"),
          ],
        ),
      ),
    );
  }
}
