import 'package:get_server/get_server.dart';

void main(List<String> args) {
  runApp(GetServerApp(
      port: 3000,
      host: "0.0.0.0",
      useLog: true,
      home: HomePage(),
      getPages: [
        GetPage(name: "/home", page: () => HomePage()),
        GetPage(name: "/json", page: () => JsonPage()),
        GetPage(
          name: "/ws",
          page: () => SocketPage(),
          method: Method.ws,
        )
      ]));
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Text('Welcome to GetX!');
  }
}

class JsonPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Json({"name": "pikachu", "color": "yello"});
  }
}

class SocketPage extends GetView {
  @override
  Widget build(BuildContext context) {
    return Socket(builder: (socket) {
      socket.onOpen((ws) {
        ws.send('socket ${ws.id} connected');
      });

      socket.on('join', (val) {
        final join = socket.join(val);
        if (join) {
          socket.sendToRoom(val, 'socket: ${socket.hashCode} join to room');
        }
      });
      socket.onMessage((data) {
        print('data: $data');
        socket.send(data);
      });

      socket.onClose((close) {
        print('socket has closed. Reason: ${close.message}');
      });
    });
  }
}
