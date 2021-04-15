from fastapi import HTTPException
import face_recognition
import cv2

threshold = 0.6

def greeting(name):
  print("Hello, " + name)


def face_process(path):
  img = cv2.imread(path)
  rgb_frame = img[:, :, ::-1]
  face_locations = face_recognition.face_locations(rgb_frame)
  if len(face_locations) != 2:
    # raise HTTPException(status_code=400, detail="Detected %d face(s). Expected 2 faces" % (len(face_locations)))
    return {
      "faces": face_locations
    }

  face_encodings = face_recognition.face_encodings(rgb_frame, face_locations, model="large")
  face_distance = face_recognition.face_distance([face_encodings[0]], face_encodings[1])[0]

  print(face_distance)
  
  return {
    "faces": face_locations,
    "threshold": threshold,
    "similarity": {
      "isIdentical": bool(face_distance < threshold),
      "distance": face_distance
    }
  }
