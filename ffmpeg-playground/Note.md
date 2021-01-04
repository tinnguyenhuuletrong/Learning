# FFMPEG Note

## Webm -> mp4 (no re-encode)

This will copy the VP9/VP8 video and Opus/Vorbis audio from WebM to MP4. This is like a "copy and paste". No re-encoding occurs, so no quality is lost and the process is very fast.

```sh
ffmpeg -i ./test.webm -c copy output.mp4
```

## mp4 trim X second from end

Note don't support webm
`Cannot use -sseof, duration of ./test.webm not known`

```sh
# X = 3
ffmpeg -sseof -3 -i ./output_full.mp4 -c copy output.mp4
```
