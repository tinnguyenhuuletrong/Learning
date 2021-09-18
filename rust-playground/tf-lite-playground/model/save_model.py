import tensorflow as tf

# default input shape 224x224x3
model = tf.keras.applications.MobileNetV3Small(
    input_shape=(224, 224, 3), weights="imagenet"
)

# save the model
directory = "mobilenetv3"
model.save(directory, save_format="h5")