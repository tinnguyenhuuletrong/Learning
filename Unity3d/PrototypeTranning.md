# Knowleage Requirement
1. C# (OOP, Interface)
2. Vector Math
	2.1 Vector vs Position
	2.2 Dot vs Cross product 
	2.3 Angle between 2 vector ( rotate torward )
3. Basic Compoment in Unity (Transform, rigidbody - trigger mode, collider)

Ref:
	- http://natureofcode.com/book/chapter-1-vectors/
	- https://docs.unity3d.com/Manual/VectorCookbook.html

Suggestion Target:
	- Making example mover (http://natureofcode.com/book/chapter-1-vectors/:Example 1.11)

# Prototype Trainning Target
Making a prototype following approve pitch ( will discuss with Khoa & Hoa to pick pitch ) 
Game Type:
- Endless Game
- Level progression at basic level (easy -> hard)
- Touch control

# Step1: 
Create project structure

1. Create project
2. Create 2 scene 
	2.1 Boot scene 
		- What Logo 
		- Yeild loading (preload resources)
		- Switch scene

	2.2 Gameplay scene
		- GameManager Class
~~~
            [Properties]
				+ Level Pool
				+ Diffilculty Progression

			[Method]
				+ Loading: Load resources 
				+ Play: Play game
				+ Restart: Restart game
~~~

3. Restart game -> Reload Gameplay Scene

# Step2:

Making core gameplay following pitch

1. Basic MC control (Touch, Mouse)
2. MC basic paramater -> Unity Compoment
3. GameLevelPrefab (Store pre defined level as prefab object)
4. Restart game

# Step3:

Adding variation into level following pitch
Add some random rule to GameLevelPrefab Obj
 * One GameLevelPrefab can be use for many on difficulty range
~~~
	ex:
        - Component show/hid sub object following level difficulty
		- Component random / re-arange child
		- Component show / hide child following level difficulty
		....
~~~
# Step4:

Implement Level Progression at basic level:
- Choice primary factor in game (Time / Score)
- Choice suitable method: 
  * Curve mapping (https://docs.unity3d.com/ScriptReference/EditorGUI.CurveField.html)
  * List of configuration: 
~~~ json
    [
        1: diff 1,
        5: diff 2,
        ....
    ]
~~~
- Implement configuration as Scriptable object (https://unity3d.com/learn/tutorials/modules/beginner/live-training-archive/scriptable-objects):
- Adjust code to query GameLevelPrefab and load

# Step5:

Tunning game


