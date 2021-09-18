use image::{imageops::FilterType, io::Reader as ImageReader, GenericImageView};
use std::error::Error;
use tensorflow::{
    Graph, ImportGraphDefOptions, SavedModelBundle, SessionOptions, SessionRunArgs, Tensor,
    DEFAULT_SERVING_SIGNATURE_DEF_KEY,
};

extern crate tensorflow;

fn main() -> Result<(), Box<dyn Error>> {
    let export_dir = "model/mobilenetv3";
    let labels = include!("labels.in");

    // Load the saved model
    let mut graph = Graph::new();
    let bundle =
        SavedModelBundle::load(&SessionOptions::new(), &["serve"], &mut graph, export_dir)?;
    let session = &bundle.session;

    // Create input variables for our addition
    let mut inp = Tensor::new(&[1, 224, 224, 3]);
    let img = ImageReader::open("img/macaque.jpg")?.decode()?;
    let img = img.resize(224, 224, FilterType::Gaussian);
    for (i, (_, _, pixel)) in img.pixels().enumerate() {
        inp[3 * i] = pixel.0[0] as f32;
        inp[3 * i + 1] = pixel.0[1] as f32;
        inp[3 * i + 2] = pixel.0[2] as f32;
    }

    // get in/out operations
    let signature = bundle
        .meta_graph_def()
        .get_signature(DEFAULT_SERVING_SIGNATURE_DEF_KEY)?;
    let x_info = signature.get_input("input_14")?;
    let op_x = &graph.operation_by_name_required(&x_info.name().name)?;
    let output_info = signature.get_output("Predictions")?;
    let op_output = &graph.operation_by_name_required(&output_info.name().name)?;

    // Run the graph.
    let mut args = SessionRunArgs::new();
    args.add_feed(op_x, 0, &inp);
    let token_output = args.request_fetch(op_output, 0);
    session.run(&mut args)?;

    let output: Tensor<f32> = args.fetch(token_output)?;

    // Calculate argmax of the output
    let (max_idx, _max_val) =
        output
            .iter()
            .enumerate()
            .fold((0, output[0]), |(idx_max, val_max), (idx, val)| {
                if &val_max > val {
                    (idx_max, val_max)
                } else {
                    (idx, *val)
                }
            });

    // This index is expected to be identical with that of the Python code,
    // but this is not guaranteed due to floating operations.
    println!("argmax={} - {:?}", max_idx, labels.get(max_idx));
    Ok(())
}
