import "package:flutter/material.dart";

class CircleButton extends StatelessWidget {
  final IconData iconData;
  final void Function()? onPressed;
  final double iconSize;

  const CircleButton(
      {Key? key,
      required this.iconData,
      required this.onPressed,
      this.iconSize = 30})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(6.0),
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        shape: BoxShape.circle,
      ),
      child: IconButton(
        icon: Icon(iconData),
        iconSize: iconSize,
        color: Colors.black,
        onPressed: onPressed,
      ),
    );
  }
}
