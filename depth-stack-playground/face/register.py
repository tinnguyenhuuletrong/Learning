import io
import requests
from PIL import Image

def register_face(img_path,user_id):
   image_data = open(img_path,"rb").read()
   response = requests.post("http://localhost:80/v1/vision/face/register",
   files={"image":image_data}, data={"userid":user_id}).json()
   print(response)

def test_face(img_path):
  test_image = open(img_path,"rb").read()
  res = requests.post("http://localhost:80/v1/vision/face/recognize",
  files={"image":test_image}).json()
  print(res)

def detect_face(img_path, save_img=False):
  image_data = open(img_path,"rb").read()
  response = requests.post("http://localhost:80/v1/vision/face",files={"image":image_data}).json()
  print(response)

  if save_img:
    image = Image.open(img_path).convert("RGB")
    i = 0
    for face in response["predictions"]:
      y_max = int(face["y_max"])
      y_min = int(face["y_min"])
      x_max = int(face["x_max"])
      x_min = int(face["x_min"])
      cropped = image.crop((x_min,y_min,x_max,y_max))
      cropped.save("out{}.jpg".format(i))
      i += 1

def compare_face_path(img1_path, img2_path):
  image_data1 = open(img1_path,"rb").read()
  image_data2 = open(img2_path,"rb").read()
  response = requests.post("http://localhost:80/v1/vision/face/match",files={"image1":image_data1,"image2":image_data2}).json()
  print(response)

def compare_face_buffer(img1_buffer, img2_buffer):
  image_data1 = img1_buffer
  image_data2 = img2_buffer
  response = requests.post("http://localhost:80/v1/vision/face/match",files={"image1":image_data1,"image2":image_data2}).json()
  print(response)

def un_merged(img_path, FIX_HEIGHT = 1024):
  image = Image.open(img_path).convert("RGB")
  y_max = FIX_HEIGHT
  y_min = 0
  x_max = image.width
  x_min = 0
  top = image.crop((x_min,y_min,x_max,y_max))

  y_max = image.height
  y_min = FIX_HEIGHT
  x_max = image.width
  x_min = 0
  bottom = image.crop((x_min,y_min,x_max,y_max))

  top.save("top.jpg")
  bottom.save("bottom.jpg")

  return (top, bottom)

def pil_to_binary(img):
  output = io.BytesIO()
  img.save(output, format='JPEG')
  return output.getvalue()


# register_face("./cruise.jpeg","Tom Cruise")
# register_face("./adele.jpeg","Adele")
# register_face("./adele.jpeg","Idris Elba")
# register_face("./perri.jpeg","Christina Perri")

# test_face("./adele2.jpeg")

test_file = "/Users/admin/Documents/projects/blockpass-private/scripts/KYC-Manual-Verify/out/tmp/606f29acc253480012675e5f/merged.jpg"
res = detect_face(test_file,
  save_img=True)
# compare_face_path("./out2.jpg", "./adele2.jpeg")

(img1,img2) = un_merged(test_file)
compare_face_buffer(pil_to_binary(img1), pil_to_binary(img2))