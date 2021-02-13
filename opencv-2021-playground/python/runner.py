import time
import pickle
import face_recognition
import cv2
import numpy as np
print("Start")
# loaded_model = pickle.load(open('myface.IsolationForest.pkl', 'rb'))
loaded_model = pickle.load(open('myface.OneClassSVM.pkl', 'rb'))

res = loaded_model.predict([np.random.rand(128)])
print("Done", res)

known_face_encodings = np.load('my_face_encode.npy')
print("Done 2", known_face_encodings)

cap = cv2.VideoCapture("/Users/admin/Downloads/Review_layout.mp4")
while (cap.isOpened()):
  ret, frame = cap.read()
  if ret == True:

    # # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_frame = frame[:, :, ::-1]

    face_locations = face_recognition.face_locations(rgb_frame)
    if len(face_locations) <= 0: continue

    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations, model="large")
  
    match_score = []
    threshold = 0.6
    for enc in face_encodings:
      face_distances = face_recognition.face_distance(known_face_encodings, enc)
      score =(face_distances < threshold).sum() / len(known_face_encodings)
      match_score.append(score)

    i = 0
    for enc in face_locations:
      (top, right, bottom, left) = enc
      cv2.rectangle(frame, (left, top), (right, bottom), (0,0,255))
      font = cv2.FONT_HERSHEY_DUPLEX
      cv2.putText(frame, str(match_score[i]), (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)
      i+=1


    res = loaded_model.predict(face_encodings)
    print(res, match_score)
    cv2.imshow('Video', frame)

    # Hit 'q' on the keyboard to quit!
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    # Break the loop
  else:
      time.sleep(10)