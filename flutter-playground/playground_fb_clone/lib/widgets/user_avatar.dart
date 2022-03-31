import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:playground_fb_clone/configs/palette.dart';

class UserAvatar extends StatelessWidget {
  final String imageUrl;
  final bool isActive;
  final bool hasBorder;

  const UserAvatar(
      {Key? key,
      required this.imageUrl,
      this.isActive = false,
      this.hasBorder = false})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          decoration: hasBorder
              ? BoxDecoration(
                  border: Border.all(color: Palette.facebookBlue, width: 2),
                  shape: BoxShape.circle,
                )
              : null,
          child: CircleAvatar(
            backgroundColor: Colors.grey[200],
            radius: 20,
            backgroundImage: CachedNetworkImageProvider(imageUrl),
          ),
        ),
        isActive
            ? Positioned(
                right: 0,
                bottom: 0,
                child: Container(
                  width: 15,
                  height: 15,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Palette.online,
                    border: Border.all(color: Colors.white),
                  ),
                ),
              )
            : const SizedBox.shrink()
      ],
    );
  }
}
