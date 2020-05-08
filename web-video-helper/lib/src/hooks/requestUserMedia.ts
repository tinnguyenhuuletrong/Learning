interface RequestUserMediaProps {
  audio: boolean;
  audioConstraints: MediaStreamConstraints["audio"];
  videoConstraints: MediaStreamConstraints["video"];
  handleUserMedia: Function;
}

export default function requestUserMedia({
  audio,
  audioConstraints,
  videoConstraints,
  handleUserMedia,
}: RequestUserMediaProps) {
  const sourceSelected = (audioConstraints: any, videoConstraints: any) => {
    const constraints: MediaStreamConstraints = {
      video: typeof videoConstraints !== "undefined" ? videoConstraints : true,
    };

    if (audio) {
      constraints.audio =
        typeof audioConstraints !== "undefined" ? audioConstraints : true;
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        handleUserMedia(null, stream);
      })
      .catch((e) => {
        handleUserMedia(e);
      });
  };

  if ("mediaDevices" in navigator) {
    sourceSelected(audioConstraints, videoConstraints);
  } else {
    const optionalSource = (id: string) => ({ optional: [{ sourceId: id }] });

    const constraintToSourceId = (constraint: any) => {
      const { deviceId } = constraint;

      if (typeof deviceId === "string") {
        return deviceId;
      }

      if (Array.isArray(deviceId) && deviceId.length > 0) {
        return deviceId[0];
      }

      if (typeof deviceId === "object" && deviceId.ideal) {
        return deviceId.ideal;
      }

      return null;
    };

    // @ts-ignore: deprecated api
    MediaStreamTrack.getSources((sources) => {
      let audioSource = null;
      let videoSource = null;

      sources.forEach((source: any) => {
        if (source.kind === "audio") {
          audioSource = source.id;
        } else if (source.kind === "video") {
          videoSource = source.id;
        }
      });

      const audioSourceId = constraintToSourceId(audioConstraints);
      if (audioSourceId) {
        audioSource = audioSourceId;
      }

      const videoSourceId = constraintToSourceId(videoConstraints);
      if (videoSourceId) {
        videoSource = videoSourceId;
      }

      sourceSelected(optionalSource(audioSource), optionalSource(videoSource));
    });
  }
}
