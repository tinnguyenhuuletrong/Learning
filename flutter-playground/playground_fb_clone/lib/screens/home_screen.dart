import "package:flutter/material.dart";
import 'package:playground_fb_clone/configs/palette.dart';
import 'package:playground_fb_clone/data/data.dart';

import '../widgets/circle_button.dart';
import '../widgets/create_post_container.dart';
import '../widgets/online_rooms_container.dart';
import '../widgets/post_container.dart';
import '../widgets/stories_container.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            backgroundColor: Colors.white,
            title: const Text(
              "facebook",
              style: TextStyle(
                  color: Palette.facebookBlue,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -1.2),
            ),
            centerTitle: false,
            floating: true,
            actions: [
              CircleButton(
                iconData: Icons.search,
                iconSize: 30,
                onPressed: () => print("Do Search"),
              ),
              CircleButton(
                iconData: Icons.mail,
                iconSize: 30,
                onPressed: () => print("Do Open Message"),
              )
            ],
          ),
          const SliverToBoxAdapter(
            child: CreatePostContainer(currentUser: currentUser),
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(0, 10, 0, 5),
            sliver: SliverToBoxAdapter(
                child: OnlineRoomsContainer(onlineUsers: onlineUsers)),
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(0, 5, 0, 5),
            sliver: SliverToBoxAdapter(
              child: StoriesContainer(
                stories: stories,
                currentUser: currentUser,
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                return PostContainer(post: posts[index]);
              },
              childCount: posts.length,
            ),
          )
        ],
      ),
    );
  }
}
