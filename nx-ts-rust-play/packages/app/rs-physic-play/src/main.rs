use anyhow::Result;
use draw::*;
use rapier2d::prelude::*;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Write;

#[derive(Serialize, Deserialize)]
struct PhysicsState {
    pub islands: IslandManager,
    pub broad_phase: BroadPhase,
    pub narrow_phase: NarrowPhase,
    pub bodies: RigidBodySet,
    pub colliders: ColliderSet,
    pub impulse_joint_set: ImpulseJointSet,
    pub multibody_joint_set: MultibodyJointSet,
    pub ccd_solver: CCDSolver,
    pub query_pipeline: QueryPipeline,
    pub integration_parameters: IntegrationParameters,
    pub gravity: Vector<f32>,

    #[serde(skip)]
    physic_pipeline: PhysicsPipeline,
}

fn setup_physics_scene(bodies: RigidBodySet, colliders: ColliderSet) -> PhysicsState {
    let island_manager = IslandManager::new();
    let broad_phase = BroadPhase::new();
    let narrow_phase = NarrowPhase::new();
    let ccd_solver = CCDSolver::new();
    let impulse_joint_set = ImpulseJointSet::new();
    let multibody_joint_set = MultibodyJointSet::new();
    let integration_parameters = IntegrationParameters::default();
    let gravity = vector![5.0, -9.81];
    let query_pipeline = QueryPipeline::new();

    PhysicsState {
        islands: island_manager,
        broad_phase,
        narrow_phase,
        bodies,
        colliders,
        impulse_joint_set,
        multibody_joint_set,
        ccd_solver,
        query_pipeline,
        integration_parameters,
        gravity,

        physic_pipeline: PhysicsPipeline::new(),
    }
}

impl PhysicsState {
    fn step(
        mut self: Self,
        physics_hooks: &impl PhysicsHooks,
        event_handler: &impl EventHandler,
    ) -> Self {
        self.physic_pipeline.step(
            &self.gravity,
            &self.integration_parameters,
            &mut self.islands,
            &mut self.broad_phase,
            &mut self.narrow_phase,
            &mut self.bodies,
            &mut self.colliders,
            &mut self.impulse_joint_set,
            &mut self.multibody_joint_set,
            &mut self.ccd_solver,
            Some(&mut self.query_pipeline),
            physics_hooks,
            event_handler,
        );

        self
    }

    fn get_bodies(self: &Self) -> &RigidBodySet {
        &self.bodies
    }

    fn get_colliders(self: &Self) -> &ColliderSet {
        &self.colliders
    }
}

struct EventLog {}
impl EventHandler for EventLog {
    fn handle_collision_event(
        &self,
        _bodies: &RigidBodySet,
        _colliders: &ColliderSet,
        _event: CollisionEvent,
        _contact_pair: Option<&ContactPair>,
    ) {
        println!("\t handle_collision_event: type={:?}", _event)
    }

    fn handle_contact_force_event(
        &self,
        _dt: Real,
        _bodies: &RigidBodySet,
        _colliders: &ColliderSet,
        _contact_pair: &ContactPair,
        _total_force_magnitude: Real,
    ) {
        println!("\t handle_contact_force_event")
    }
}

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

    let ball_collider = ColliderBuilder::ball(0.5)
        .restitution(0.7)
        .active_events(ActiveEvents::COLLISION_EVENTS)
        .build();

    let ball_body_handle = rigid_body_set.insert(rigid_body_ball);
    let ball_collider_handle =
        collider_set.insert_with_parent(ball_collider, ball_body_handle, &mut rigid_body_set);

    /* Create other structures necessary for the simulation. */
    let mut scene = setup_physics_scene(rigid_body_set, collider_set);
    let physics_hooks = ();
    let event_handler: EventLog = EventLog {};

    // create a canvas to draw on
    let mut canvas = Canvas::new(100, 10);

    /* Run the game loop, stepping the simulation once per frame. */
    for it in 0..200 {
        scene = scene.step(&physics_hooks, &event_handler);

        let ball_body = scene.get_bodies().get(ball_body_handle).unwrap();
        let trans = ball_body.translation();
        println!("It {} : Ball pos: {} - {}", it, trans.x, trans.y);

        do_render(&scene, &mut canvas);
    }

    play_with_serialize(&scene).unwrap();
    render::save(&canvas, "tmp/display.svg", SvgRenderer::new()).expect("Failed to save");
    println!("Screen rendered into tmp/display.svg")
}

fn play_with_serialize(scene: &PhysicsState) -> Result<()> {
    let serialized = bincode::serialize(scene)?;
    let hash = sha256::digest(&serialized);

    let mut f = File::create("./tmp/physic_state.bin")?;
    f.write_all(&serialized)?;

    println!(
        "Serialized data as bin. Saved to: physic_state.bin. hash: {}",
        &hash
    );

    println!(
        "\tDeterminism test: sha256(snapshot) == 27c364d5b8dc962ed24f988b0063c3bf718ca00009f4f7c96e7538dee9843084 : {}",
        "27c364d5b8dc962ed24f988b0063c3bf718ca00009f4f7c96e7538dee9843084" == hash
    );

    Ok(())
}

fn do_render(scene: &PhysicsState, canvas: &mut Canvas) {
    let colliders = scene.get_colliders();

    for it in colliders.iter() {
        let shape_type = it.1.shape().shape_type();

        match shape_type {
            ShapeType::Ball => {
                let ball = it.1.shape().as_ball().unwrap();
                let pos = it.1.position().translation;
                let draw_shape = Drawing::new()
                    .with_shape(draw::Shape::Circle {
                        radius: ball.radius.ceil() as u32,
                    })
                    .with_xy(pos.x, -pos.y)
                    .with_style(Style::filled(Color::black()));
                canvas.display_list.add(draw_shape);
            }
            ShapeType::Cuboid => {
                let cuboid = it.1.shape().as_cuboid().unwrap();
                let pos = it.1.position().translation;
                let draw_shape = Drawing::new()
                    .with_shape(draw::Shape::Rectangle {
                        width: (cuboid.half_extents.x * 2.0).ceil() as u32,
                        height: (cuboid.half_extents.y * 2.0).ceil() as u32,
                    })
                    .with_xy(pos.x, -pos.y)
                    .with_style(Style::filled(Color::black()));

                canvas.display_list.add(draw_shape);
            }
            _ => {}
        };
    }
}
