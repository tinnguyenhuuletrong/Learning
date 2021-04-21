from fastapi import HTTPException
from sklearn.neighbors import LocalOutlierFactor
import face_recognition
import numpy as np
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
        return {"faces": face_locations}

    face_encodings = face_recognition.face_encodings(
        rgb_frame, face_locations, model="large"
    )
    face_distance = face_recognition.face_distance(
        [face_encodings[0]], face_encodings[1]
    )[0]

    print(face_distance)

    return {
        "faces": face_locations,
        "threshold": threshold,
        "similarity": {
            "isIdentical": bool(face_distance < threshold),
            "distance": face_distance,
        },
    }


def video_process(file, log=print):
    cap = cv2.VideoCapture(file)
    faces = []
    frameCount = 0
    log("Step 1: Detect faces")

    while cap.isOpened():
        ret, frame = cap.read()
        if ret == True:
            # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
            rgb_frame = frame[:, :, ::-1]

            face_locations = face_recognition.face_locations(
                rgb_frame, number_of_times_to_upsample=0, model="cnn"
            )
            if len(face_locations) <= 0:
                continue

            face_encodings = face_recognition.face_encodings(
                rgb_frame, face_locations, model="large"
            )
            for enc in face_encodings:
                faces.append(enc)

            frameCount += 1
            log(frameCount)
        else:
            break

    log("Step 2: Detected %d face(s). Train model" % len(faces))

    X_train = faces
    X_test = faces
    model = LocalOutlierFactor(novelty=True)
    model.fit(X_train)

    test_res = model.predict(X_test)
    log("Step 3: Test result")
    log(test_res)
    return model, faces


def face_detect(model, byte):
    rgb_frame = load_image_into_numpy_array(byte)
    face_locations = face_recognition.face_locations(rgb_frame)

    # no faces
    if len(face_locations) <= 0:
        return {"face_locations": [], "results": []}
    face_encodings = face_recognition.face_encodings(
        rgb_frame, face_locations, model="large"
    )

    res = model.predict(face_encodings)
    return {"face_locations": face_locations, "results": res.tolist()}


def load_image_into_numpy_array(data):
    npimg = np.frombuffer(data, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    return cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)


def draw_face_rec(data, face_locations, results):
    npimg = np.frombuffer(data, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    i = 0
    for enc in face_locations:
        (top, right, bottom, left) = enc
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255))
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(
            frame, str(results[i]), (left - 6, top - 10), font, 1.0, (0, 255, 0), 1
        )
        i += 1
    return cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
