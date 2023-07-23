use nannou::noise::NoiseFn;
use nannou::prelude::*;

const CAPTURE: bool = false;
const NUM_PARTICLES: u32 = 2000;

fn main() {
    nannou::app(new_model)
        .update(update)
        // .backends(wgpu::Backends::METAL)
        .loop_mode(LoopMode::RefreshSync)
        .run();
}

struct Particle {
    pos: Vec2,
    vel: Vec2,
}

impl Particle {
    fn new(x: f32, y: f32) -> Particle {
        Particle {
            pos: vec2(x, y),
            vel: vec2(0., 0.),
        }
    }

    fn update(&mut self, dir: Vec2) {
        self.pos += self.vel;
        self.vel += dir;
        self.vel *= 0.8;
    }
}

struct Model {
    particles: Vec<Particle>,
}

fn new_model(app: &App) -> Model {
    app.new_window().size(600, 600).view(draw).build().unwrap();

    let r = app.window_rect().right() as f32;
    let l = app.window_rect().left() as f32;

    let w = l - r;
    let t = app.window_rect().top() as f32;
    let b = app.window_rect().bottom() as f32;

    let h = t - b;

    let mut p = vec![];
    for _i in 0..NUM_PARTICLES {
        let x = random_f32() * w + r;
        let y = random_f32() * h + b;
        p.push(Particle::new(x, y));
    }

    Model { particles: p }
}

fn update(app: &App, model: &mut Model, _update: Update) {
    let noise = nannou::noise::Perlin::new();
    let t: f64 = app.elapsed_frames() as f64 / 100.;
    for i in 0..model.particles.len() {
        let p = &mut model.particles[i];
        let x = noise.get([
            p.pos.x as f64 / 128.,
            p.pos.y as f64 / 137.,
            t + i as f64 / 1000.,
        ]);
        let y = noise.get([
            -p.pos.y as f64 / 128.,
            p.pos.x as f64 / 137.,
            t + i as f64 / 1000.,
        ]);

        let a = vec2(x as f32, y as f32);
        p.update(a);
    }
}

fn draw(app: &App, model: &Model, frame: Frame) {
    let draw = app.draw();
    let fps = 1.0 / app.duration.since_prev_update.as_secs_f32();
    let t = (app.elapsed_frames() as f32) * 0.02;
    let w = (t * 0.832).cos();
    for p in &model.particles {
        draw.ellipse()
            .xy(p.pos)
            .w_h(2.0, 2.0)
            .color(hsla(0.1, 1. + w, 5., 0.01));
    }
    draw_fps(app, &draw, fps);

    draw.to_frame(app, &frame).unwrap();
    if CAPTURE {
        let file_path = captured_frame_path(app, &frame);
        app.main_window().capture_frame(file_path);
    }
}

fn draw_fps(app: &App, draw: &Draw, fps: f32) {
    let l = app.window_rect().left() as f32;
    let t = app.window_rect().top() as f32;

    draw.rect().x_y(0.0, t - 20.0).w_h(160.0, 40.0).color(BLACK);
    draw.text(format!("FPS:{:.0}", fps).as_str())
        .x_y(0.0, t - 20.0)
        .align_text_middle_y()
        .font_size(20)
        .color(WHITE);
}

fn captured_frame_path(app: &App, frame: &Frame) -> std::path::PathBuf {
    app.project_path()
        .expect("failed to locate `project_path`")
        .join("frames")
        .join(format!("{:04}", frame.nth()))
        .with_extension("png")
}
