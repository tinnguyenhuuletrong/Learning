use bevy::input::*;
use bevy::prelude::*;
use bevy_rapier2d::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugins(RapierPhysicsPlugin::<NoUserData>::default())
        .add_plugins(RapierDebugRenderPlugin::default())
        .add_systems(Startup, setup_graphics)
        .add_systems(Startup, setup_physics)
        // .add_systems(Update, print_ball_altitude)
        .add_systems(Update, update_character_system)
        .add_systems(PostUpdate, read_character_result_system)
        .run();
}

fn setup_graphics(mut commands: Commands) {
    // Add a camera so we can see the debug-render.
    commands.spawn(Camera2dBundle::default());
}

fn setup_physics(mut commands: Commands) {
    let mut tmp = Friction::coefficient(17.7);
    tmp.combine_rule = CoefficientCombineRule::Min;

    /* Create the ground. */
    commands
        .spawn(RigidBody::Fixed)
        .insert(Collider::cuboid(2000.0, 50.0))
        .insert(tmp)
        .insert(TransformBundle::from(Transform::from_xyz(0.0, -100.0, 0.0)));

    /* Create the bouncing ball. */
    commands
        .spawn(RigidBody::Dynamic)
        .insert(GravityScale(2.0))
        .insert(Collider::cuboid(50.0, 10.0))
        .insert(Restitution::coefficient(0.7))
        .insert(TransformBundle::from(Transform::from_xyz(0.0, 400.0, 0.0)));

    commands
        .spawn(RigidBody::Fixed)
        .insert(Collider::ball(10.0))
        .insert(Restitution::coefficient(0.7))
        .insert(TransformBundle::from(Transform::from_xyz(5.0, 100.0, 0.0)));

    commands
        .spawn(RigidBody::KinematicPositionBased)
        .insert(Collider::ball(20.0))
        .insert(TransformBundle::from(Transform::from_xyz(-500.0, 0.0, 0.0)))
        .insert(KinematicCharacterController::default());
}

fn print_ball_altitude(positions: Query<&Transform, With<RigidBody>>) {
    for transform in positions.iter() {
        println!("Ball altitude: {}", transform.translation.y);
    }
}

fn update_character_system(
    mut controllers: Query<&mut KinematicCharacterController>,
    keyboard_input: Res<Input<KeyCode>>,
) {
    if keyboard_input.pressed(KeyCode::Right) {
        info!("move right");
        for mut controller in controllers.iter_mut() {
            controller.translation =
                Some(controller.translation.unwrap_or_default() + Vec2::new(1.0, 0.0));
        }
    }
    if keyboard_input.pressed(KeyCode::Left) {
        info!("move left");
        for mut controller in controllers.iter_mut() {
            controller.translation =
                Some(controller.translation.unwrap_or_default() + Vec2::new(-1.0, 0.0));
        }
    }
    if keyboard_input.pressed(KeyCode::Up) {
        info!("move up");
        for mut controller in controllers.iter_mut() {
            controller.translation =
                Some(controller.translation.unwrap_or_default() + Vec2::new(0.0, 5.0));
        }
    }

    // gravity
    for mut controller in controllers.iter_mut() {
        controller.translation =
            Some(controller.translation.unwrap_or_default() + Vec2::new(0.0, -1.0));
    }
}

fn read_character_result_system(controllers: Query<(Entity, &KinematicCharacterControllerOutput)>) {
    for (entity, output) in controllers.iter() {
        println!(
            "Entity {:?} moved by {:?} and touches the ground: {:?}, collision len: {:?}",
            entity,
            output.effective_translation,
            output.grounded,
            output.collisions.len()
        );
    }
}
