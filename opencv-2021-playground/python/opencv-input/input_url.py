import numpy as np
import cv2

# Open a sample video available in sample-videos
vcap = cv2.VideoCapture('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
if not vcap.isOpened():
   print("URL error ?")

while(True):
    # Capture frame-by-frame
    ret, frame = vcap.read()
    #print cap.isOpened(), ret
    if frame is not None:
        # Display the resulting frame
        cv2.imshow('frame',frame)
        # Press q to close the video windows before it ends if you want
        if cv2.waitKey(22) & 0xFF == ord('q'):
            break
    else:
        break

# When everything done, release the capture
vcap.release()
cv2.destroyAllWindows()