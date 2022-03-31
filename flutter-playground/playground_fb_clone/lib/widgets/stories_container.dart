import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:playground_fb_clone/configs/palette.dart';
import 'package:playground_fb_clone/widgets/user_avatar.dart';

import '../models/model.dart';

class StoriesContainer extends StatelessWidget {
  final List<Story> stories;
  final User currentUser;

  const StoriesContainer({
    Key? key,
    required this.stories,
    required this.currentUser,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200,
      color: Colors.white,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        scrollDirection: Axis.horizontal,
        itemCount: 1 + stories.length,
        itemBuilder: ((context, index) {
          if (index == 0) {
            return _UserStory(
              currentUser: currentUser,
              isAddStory: true,
            );
          }
          final story = stories[index - 1];
          return _UserStory(
            currentUser: story.user,
            isAddStory: false,
            story: story,
          );
        }),
      ),
    );
  }
}

class _UserStory extends StatelessWidget {
  final bool isAddStory;
  final User currentUser;
  final Story? story;

  const _UserStory(
      {Key? key,
      this.isAddStory = false,
      required this.currentUser,
      this.story})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(4),
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: CachedNetworkImage(
              imageUrl:
                  (isAddStory ? currentUser.imageUrl : story?.imageUrl) ?? '',
              height: double.infinity,
              width: 110,
              fit: BoxFit.cover,
            ),
          ),
          Container(
            width: 110,
            decoration: BoxDecoration(
              gradient: Palette.storyGradient,
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          Positioned(
            left: 8,
            top: 8,
            child: isAddStory
                ? Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white,
                    ),
                    child: IconButton(
                      padding: EdgeInsets.zero,
                      onPressed: () {
                        print("On Add Story");
                      },
                      color: Palette.facebookBlue,
                      iconSize: 30,
                      icon: const Icon(
                        Icons.add,
                      ),
                    ),
                  )
                : UserAvatar(
                    imageUrl: currentUser.imageUrl,
                    hasBorder: true,
                  ),
          ),
          Positioned(
            bottom: 8,
            left: 8,
            right: 8,
            child: Text(
              isAddStory ? "Add a story" : story?.user.name ?? "",
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          )
        ],
      ),
    );
  }
}
