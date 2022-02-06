// ignore_for_file: prefer_function_declarations_over_variables

import 'dart:convert';
import 'package:http/http.dart' as http;

class Example {
  Future<String> _getIPAddress() {
    final url = Uri.https('httpbin.org', '/ip');
    return http.get(url).then((response) {
      String ip = jsonDecode(response.body)?['origin'];
      return ip;
    });
  }
}

main() async {
  final example = Example();

  final myStopWatch = () {
    final start = DateTime.now().millisecondsSinceEpoch;
    return () => DateTime.now().millisecondsSinceEpoch - start;
  };

  try {
    final sw = myStopWatch();
    var ip = await example._getIPAddress();
    final totalMs = sw();

    print('''
My IP: $ip
Duration: $totalMs ms
''');
  } catch (e) {
    print("Error: $e");
  }
}
