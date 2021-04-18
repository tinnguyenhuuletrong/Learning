from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile, HTTPException
import os
import shutil
import pickle
import module
import traceback

app = FastAPI()

@app.get("/")
def read_root(name = "unknown"):
  return {"Hello": name }


class ProcessBody(BaseModel):
  filePath: str

@app.post("/process")
def process_image(body: ProcessBody):
  res = module.face_process(body.filePath)
  print(res)
  return res



@app.post("/train/video/{uid}")
async def process_train_video(uid, file : UploadFile = File(...)):
  workingDir = "./tmp/%s/" % uid
  videoFilePath = "%s/video.mp4" % workingDir
  modelFilePath = "%s/model.pkl" % workingDir

  # ensure file exists
  os.makedirs(workingDir, exist_ok=True)

  # write video
  with open(videoFilePath, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)

  model, faces = module.video_process(videoFilePath)
  pickle.dump(model, open(modelFilePath, 'wb'))
  return {"id": uid, "faces": len(faces)}


@app.post("/recognition/image/{uid}")
async def process_verify_img(uid, file : UploadFile = File(...)):
  workingDir = "./tmp/%s/" % uid
  modelFilePath = "%s/model.pkl" % workingDir

  if not os.path.exists(modelFilePath):
    raise HTTPException(status_code=400, detail="Model not found for uid=%s. Please call /train/video/:uid first" % (uid))

  loaded_model = pickle.load(open(modelFilePath, 'rb'))
  buffer = await file.read()

  try:
    res = module.face_detect(loaded_model, buffer)
  except BaseException as e:
    print(traceback.format_exc())
    raise HTTPException(status_code=500, detail="Internal error")

  loaded_model = None
  return res
