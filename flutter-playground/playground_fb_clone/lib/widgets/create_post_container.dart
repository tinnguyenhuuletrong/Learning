import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:playground_fb_clone/models/user_model.dart';
import 'package:playground_fb_clone/widgets/user_avatar.dart';

class CreatePostContainer extends StatelessWidget {
  final User currentUser;

  const CreatePostContainer({
    Key? key,
    required this.currentUser,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 8),
      color: Colors.white,
      child: Column(children: [
        Row(
          children: [
            UserAvatar(imageUrl: currentUser.imageUrl),
            const SizedBox(
              width: 8,
            ),
            const Expanded(
              child: TextField(
                decoration:
                    InputDecoration.collapsed(hintText: "What's on your mind?"),
              ),
            )
          ],
        ),
        const Divider(
          height: 10,
          thickness: 0.5,
        ),
        SizedBox(
          height: 40,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              TextButton.icon(
                onPressed: () {
                  print("Do Webcam");
                },
                icon: const Icon(Icons.videocam, color: Colors.red),
                label: const Text(
                  "Live",
                  style: TextStyle(color: Colors.black),
                ),
              ),
              const VerticalDivider(width: 8),
              TextButton.icon(
                onPressed: () {
                  print("Do Photo");
                },
                icon: const Icon(Icons.photo_library, color: Colors.green),
                label: const Text(
                  "Photo",
                  style: TextStyle(color: Colors.black),
                ),
              ),
              const VerticalDivider(width: 8),
              TextButton.icon(
                onPressed: () {
                  print("Do Live");
                },
                icon: const Icon(Icons.video_call, color: Colors.purpleAccent),
                label: const Text(
                  "Room",
                  style: TextStyle(color: Colors.black),
                ),
              ),
              const VerticalDivider(width: 8)
            ],
          ),
        )
      ]),
    );
  }
}
