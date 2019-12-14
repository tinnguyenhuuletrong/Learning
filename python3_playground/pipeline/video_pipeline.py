from lib.capture_video import CaptureVideo
from lib.process_grayscale import ProcessGrayscale
from lib.detect_faces_dlib import DlibDetectFaces
from lib.combine_hstack import CombineHStack
from lib.display_video import DisplayVideo


def main(args={}):
    capture_video = CaptureVideo(0)
    process_grayscale = ProcessGrayscale('input', 'grayscale')
    detect_faces = DlibDetectFaces(
        'input', data_path="./data/shape_predictor_68_face_landmarks.dat")
    combine_hstack = CombineHStack(['input', 'grayscale', 'hog'], 'output')
    display_video = DisplayVideo(src="input")

    # pipeline = capture_video | process_grayscale | combine_hstack | display_video
    # pipeline = capture_video | display_video
    pipeline = capture_video | detect_faces | display_video

    try:
        for _ in pipeline:
            pass
    except StopIteration:
        return
    except KeyboardInterrupt:
        return
    finally:
        capture_video.cleanup()
        display_video.cleanup()


if __name__ == "__main__":
    args = {}
    main(args)
