import 'package:flutter/material.dart';
import 'package:playground_fb_clone/configs/palette.dart';
import 'package:playground_fb_clone/models/model.dart';

import 'user_avatar.dart';

class OnlineRoomsContainer extends StatelessWidget {
  final List<User> onlineUsers;

  const OnlineRoomsContainer({
    Key? key,
    required this.onlineUsers,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      height: 60,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
        scrollDirection: Axis.horizontal,
        itemCount: 1 + onlineUsers.length,
        itemBuilder: ((context, index) {
          if (index == 0) {
            return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: const _CreateRoomButton());
          }
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: UserAvatar(
              imageUrl: onlineUsers[index - 1].imageUrl,
              isActive: true,
            ),
          );
        }),
      ),
    );
  }
}

class _CreateRoomButton extends StatelessWidget {
  const _CreateRoomButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: () {
        print("On Create new room");
      },
      style: OutlinedButton.styleFrom(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30.0),
        ),
        side:
            BorderSide(width: 3, color: Colors.blueAccent[100] ?? Colors.blue),
      ),
      child: Row(
        children: [
          ShaderMask(
            shaderCallback: (Rect bounds) {
              return Palette.createRoomGradient.createShader(bounds);
            },
            child: const Icon(
              Icons.video_call,
              size: 35,
              color: Colors.white,
            ),
          ),
          const SizedBox(
            width: 4,
          ),
          const Text("Create\nRoom")
        ],
      ),
    );
  }
}
