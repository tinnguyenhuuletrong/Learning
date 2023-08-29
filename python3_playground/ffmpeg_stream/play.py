import time
import numpy as np
from video_stream_ffmpeg import VideoStreamFFmpeg
from video_stream_cv import VideoStreamCV


def timeit(func):
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        result = func(*args, **kwargs)
        t1 = time.perf_counter()
        print(f"Main function time: {round(t1-t0, 4)}s")
        return result

    return wrapper


def computation_task():
    for _ in range(5000000):
        9999 * 9999


@timeit
def run(cam: VideoStreamCV | VideoStreamFFmpeg, run_task: bool):
    timer = []
    for _ in range(100):
        t0 = time.perf_counter()
        cam.read()
        timer.append(time.perf_counter() - t0)

        if run_task:
            computation_task()

    cam.release()
    return round(np.mean(timer), 4)


def main():
    fsp = 30
    resolution = (1920, 1080)

    for run_task in [False, True]:
        ff_cam = VideoStreamFFmpeg(src=0, fps=fsp, resolution=resolution)
        cv_cam = VideoStreamCV(src=0, fps=fsp, resolution=resolution)

        print(f"FFMPEG, task {run_task}:")
        print(f"Mean frame read time: {run(cam=ff_cam, run_task=run_task)}s\n")
        print(f"CV2, task {run_task}:")
        print(f"Mean frame read time: {run(cam=cv_cam, run_task=run_task)}s\n")


if __name__ == "__main__":
    main()
