import requests

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

register_face("./cruise.jpeg","Tom Cruise")
register_face("./adele.jpeg","Adele")
register_face("./adele.jpeg","Idris Elba")
register_face("./perri.jpeg","Christina Perri")

test_face("./adele2.jpeg")