from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI
import module

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
