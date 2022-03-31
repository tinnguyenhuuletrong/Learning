import 'package:flutter/material.dart';
import 'package:playground_fb_clone/models/model.dart';

class PostContainer extends StatelessWidget {
  final Post post;

  const PostContainer({Key? key, required this.post}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.fromLTRB(0, 5, 0, 5),
      height: 100,
      color: Colors.blue[200],
      child: Row(
        children: [],
      ),
    );
  }
}
