const cv = require("opencv4nodejs");

const data = cv.imread("./avatar.jpg");

cv.imshow("pic", data);
cv.waitKey();
