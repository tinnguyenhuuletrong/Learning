import cv2

def process(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    frame = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
    return frame


cap = cv2.VideoCapture("tcp://localhost:3000")
# cap = cv2.VideoCapture("/Users/admin/Downloads/money.mp4")
frame_width = int(cap.get(3))
frame_height = int(cap.get(4))
fps = cap.get(cv2.CAP_PROP_FPS)
size = (frame_width, frame_height)
print(size, fps)

result = cv2.VideoWriter("%s.mp4" % "out", cv2.VideoWriter_fourcc(*"mp4v"), fps, size)

while cap.isOpened():
    ret, frame = cap.read()
    if ret == False:
        break
    result.write(process(frame))

cap.release()
result.release()
cv2.destroyAllWindows()
