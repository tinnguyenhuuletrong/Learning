import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get/get.dart';
import 'package:playground_budget_notion/services/service_notion.dart';

import 'pages/pages.dart';

void main() async {
  await dotenv.load(fileName: ".env");
  await initAllServices();
  return runApp(GetMaterialApp(
    debugShowCheckedModeBanner: false,
    theme: ThemeData.from(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.pink)),
    initialRoute: "/",
    getPages: [
      GetPage(name: "/", page: () => const Home()),
      GetPage(name: "/detail/:id", page: () => const DetailPage()),
    ],
  ));
}

Future<void> initAllServices() async {
  await Get.putAsync(() => ServiceNotion().init());
}
