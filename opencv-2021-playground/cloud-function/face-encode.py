import json
import face_recognition
from sklearn.neighbors import LocalOutlierFactor
import cv2

def encode_face_from_image(path): 
  img = cv2.imread(path)
  # # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
  rgb_frame = img[:, :, ::-1]

  face_locations = face_recognition.face_locations(rgb_frame)
  if len(face_locations) <= 0: return

  print(face_locations)
  face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
  return face_encodings
  
def mp4_to_model(path):
  cap = cv2.VideoCapture(path)
  faces = []
  frameCount = 0
  while (cap.isOpened()):
      ret, frame = cap.read()
      if ret == True:
          # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
          rgb_frame = frame[:, :, ::-1]

          face_locations = face_recognition.face_locations(rgb_frame)
          if len(face_locations) <= 0: continue

          face_encodings = face_recognition.face_encodings(rgb_frame, face_locations, model="large")
          for enc in face_encodings:
            faces.append(enc)

          frameCount += 1
          print("\t", frameCount)
      else:
          break
  print("Done")
  return faces

def train_detector(faces):
  X_train = faces
  X_test = faces
  model = LocalOutlierFactor(novelty=True)
  model.fit(X_train)
  model.predict(X_test)
  return model


def crop_img(path, region):
  top, right, bottom, left = region
  img = cv2.imread(path)
  crop_img = img[top:bottom, left:right]
  cv2.imshow("cropped", crop_img)
  cv2.waitKey(0)

if __name__ == "__main__":
  print('begin')
  faces = mp4_to_model('./my_face.mp4')
  print('train')
  model = train_detector(faces)
  print('train complete')
  test_set = [
    './test_data/me.jpg',
    './test_data/unknown.jpg', 
    './test_data/multiple.jpg', 
    './test_data/group.jpg', 
    './test_data/tin_an.jpg',
    './test_data/tin_ton.jpg',
    './test_data/company.jpg'
  ]

  for p in test_set:
    print("\t", p, ":", model.predict(encode_face_from_image(p)))

  # crop_img('./test_data/company.jpg', (294, 449, 330, 413))