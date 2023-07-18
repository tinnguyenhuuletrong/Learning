use rapier2d::prelude::*;

fn main() {
    let mut rigid_body_set = RigidBodySet::new();
    let mut collider_set = ColliderSet::new();

    // creat ground
    let ground_collier = ColliderBuilder::cuboid(100.0, 0.1).build();
    let ground_collider_handle = collider_set.insert(ground_collier);

    // creat bouncing ball
    let rigid_body_ball = RigidBodyBuilder::dynamic()
        .translation(vector![0.0, 10.0])
        .build();

    let ball_collider = ColliderBuilder::ball(0.5).restitution(0.7).build();
    let ball_body_handle = rigid_body_set.insert(rigid_body_ball);
    let ball_collider_handle =
        collider_set.insert_with_parent(ball_collider, ball_body_handle, &mut rigid_body_set);

    /* Create other structures necessary for the simulation. */
    let gravity = vector![2.0, -9.81];
    let integration_parameters = IntegrationParameters::default();
    let mut physics_pipeline = PhysicsPipeline::new();
    let mut island_manager = IslandManager::new();
    let mut broad_phase = BroadPhase::new();
    let mut narrow_phase = NarrowPhase::new();
    let mut impulse_joint_set = ImpulseJointSet::new();
    let mut multibody_joint_set = MultibodyJointSet::new();
    let mut ccd_solver = CCDSolver::new();
    let physics_hooks = ();
    let event_handler = ();

    /* Run the game loop, stepping the simulation once per frame. */
    for _ in 0..200 {
        physics_pipeline.step(
            &gravity,
            &integration_parameters,
            &mut island_manager,
            &mut broad_phase,
            &mut narrow_phase,
            &mut rigid_body_set,
            &mut collider_set,
            &mut impulse_joint_set,
            &mut multibody_joint_set,
            &mut ccd_solver,
            None,
            &physics_hooks,
            &event_handler,
        );

        let ball_body = &rigid_body_set[ball_body_handle];
        let trans = ball_body.translation();
        println!("Ball pos: {} - {}", trans.x, trans.y);
    }

    // Shape -> 2D points
    let tmp = collider_set
        .get(ground_collider_handle)
        .unwrap()
        .shape()
        .as_cuboid()
        .unwrap()
        .to_polyline();

    println!("Ground Poly: {:#?}", tmp);

    let tmp = collider_set
        .get(ball_collider_handle)
        .unwrap()
        .shape()
        .as_ball()
        .unwrap()
        .to_polyline(10);

    println!("Ball Poly: {:#?}", tmp);
}
