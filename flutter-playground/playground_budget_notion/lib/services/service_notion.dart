import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get/get.dart';
import 'package:playground_budget_notion/model/budget_item.dart';

class ServiceNotion extends GetxService {
  late _NotionHttpProvider _httpProvider;
  List<BudgetItem> allItems = <BudgetItem>[].obs;

  Future<ServiceNotion> init() async {
    // Todo: any init logic
    _httpProvider = _NotionHttpProvider();
    return this;
  }

  Future<List<BudgetItem>> fetchData() async {
    final httpResponse = await _httpProvider.listBudgetItems();
    final results = httpResponse.body["results"] as List;
    allItems.clear();
    allItems.addAll(results.map((e) => BudgetItem.fromMap(e)));
    return allItems;
  }
}

class _NotionHttpProvider extends GetConnect {
  Future<Response> listBudgetItems() async {
    final res = await post(
        'https://api.notion.com/v1/databases/7c34fafb3e7748b8a6b1d6dc47ec589b/query',
        {},
        headers: {
          "Authorization": "Bearer ${dotenv.env['NOTION_TOKEN']}",
          "Notion-Version": "2022-02-22"
        });
    if (res.hasError) throw ErrorDescription(res.bodyString ?? "");
    return res;
  }
}
