#include <dlfcn.h>
#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>
#include <libavutil/avutil.h>
#include <libavutil/imgutils.h>
#include <libavutil/opt.h>
#include <libswscale/swscale.h>
#include <stdio.h>
#include <stdlib.h>

int to_mp4(void *buf, size_t buflen, void **out, size_t *outlen) {
  AVFormatContext *input_ctx = NULL, *output_ctx = NULL;
  AVIOContext *input_io_ctx = NULL, *output_io_ctx = NULL;
  uint8_t *output_buffer = NULL;
  int ret = 0;
  int64_t *last_dts = NULL;

  // Register all codecs and formats

  // Create input IO context
  input_io_ctx = avio_alloc_context(buf, buflen, 0, NULL, NULL, NULL, NULL);
  if (!input_io_ctx) {
    ret = AVERROR(ENOMEM);
    goto end;
  }

  // Allocate input format context
  input_ctx = avformat_alloc_context();
  if (!input_ctx) {
    ret = AVERROR(ENOMEM);
    goto end;
  }

  input_ctx->pb = input_io_ctx;

  // Open input
  if ((ret = avformat_open_input(&input_ctx, NULL, NULL, NULL)) < 0) {
    goto end;
  }

  // Retrieve stream information
  if ((ret = avformat_find_stream_info(input_ctx, NULL)) < 0) {
    goto end;
  }

  // Allocate output format context
  avformat_alloc_output_context2(&output_ctx, NULL, "mp4", NULL);
  if (!output_ctx) {
    ret = AVERROR(ENOMEM);
    goto end;
  }

  // Create output IO context
  ret = avio_open_dyn_buf(&output_ctx->pb);
  if (ret < 0) {
    goto end;
  }

  // Copy streams
  for (int i = 0; i < input_ctx->nb_streams; i++) {
    AVStream *in_stream = input_ctx->streams[i];
    AVStream *out_stream = avformat_new_stream(output_ctx, NULL);
    if (!out_stream) {
      ret = AVERROR(ENOMEM);
      goto end;
    }

    ret = avcodec_parameters_copy(out_stream->codecpar, in_stream->codecpar);
    if (ret < 0) {
      goto end;
    }
    out_stream->codecpar->codec_tag = 0;
  }

  // Write header
  ret = avformat_write_header(output_ctx, NULL);
  if (ret < 0) {
    goto end;
  }

  // Allocate last_dts array
  last_dts = calloc(input_ctx->nb_streams, sizeof(int64_t));
  if (!last_dts) {
    ret = AVERROR(ENOMEM);
    goto end;
  }

  // Copy packets
  AVPacket pkt;
  while (1) {
    ret = av_read_frame(input_ctx, &pkt);
    if (ret < 0) {
      break;
    }

    AVStream *in_stream = input_ctx->streams[pkt.stream_index];
    AVStream *out_stream = output_ctx->streams[pkt.stream_index];

    // Convert timestamps
    pkt.pts =
        av_rescale_q_rnd(pkt.pts, in_stream->time_base, out_stream->time_base,
                         AV_ROUND_NEAR_INF | AV_ROUND_PASS_MINMAX);
    pkt.dts =
        av_rescale_q_rnd(pkt.dts, in_stream->time_base, out_stream->time_base,
                         AV_ROUND_NEAR_INF | AV_ROUND_PASS_MINMAX);
    pkt.duration =
        av_rescale_q(pkt.duration, in_stream->time_base, out_stream->time_base);

    // Ensure monotonically increasing DTS
    if (pkt.dts <= last_dts[pkt.stream_index]) {
      pkt.dts = last_dts[pkt.stream_index] + 1;
      pkt.pts = FFMAX(pkt.pts, pkt.dts);
    }
    last_dts[pkt.stream_index] = pkt.dts;

    pkt.pos = -1;

    ret = av_interleaved_write_frame(output_ctx, &pkt);
    if (ret < 0) {
      char errbuf[AV_ERROR_MAX_STRING_SIZE];
      av_strerror(ret, errbuf, AV_ERROR_MAX_STRING_SIZE);
      fprintf(stderr, "Error writing frame: %s\n", errbuf);
      break;
    }
    av_packet_unref(&pkt);
  }

  // Write trailer
  ret = av_write_trailer(output_ctx);
  if (ret < 0) {
    goto end;
  }

  // Get the output buffer
  *outlen = avio_close_dyn_buf(output_ctx->pb, &output_buffer);
  *out = output_buffer;
  output_ctx->pb = NULL; // Set to NULL to prevent double free

  ret = 0; // Success

end:
  if (input_ctx) {
    avformat_close_input(&input_ctx);
  }
  if (output_ctx) {
    avformat_free_context(output_ctx);
  }
  if (input_io_ctx) {
    av_freep(&input_io_ctx->buffer);
    av_freep(&input_io_ctx);
  }

  return ret;
}

int convert_file_to_mp4(const char *input_filename,
                        const char *output_filename) {
  FILE *input_file = NULL;
  FILE *output_file = NULL;
  uint8_t *input_buffer = NULL;
  uint8_t *output_buffer = NULL;
  size_t input_size = 0;
  size_t output_size = 0;
  int ret = 0;

  // Open the input file
  input_file = fopen(input_filename, "rb");
  if (!input_file) {
    perror("Could not open input file");
    return -1;
  }

  // Get the size of the input file
  fseek(input_file, 0, SEEK_END);
  input_size = ftell(input_file);
  fseek(input_file, 0, SEEK_SET);

  // Allocate memory for the input buffer
  input_buffer = (uint8_t *)malloc(input_size);
  if (!input_buffer) {
    perror("Could not allocate input buffer");
    ret = -1;
    goto cleanup;
  }

  // Read the input file into the buffer
  if (fread(input_buffer, 1, input_size, input_file) != input_size) {
    perror("Could not read input file");
    ret = -1;
    goto cleanup;
  }

  // Call the to_mp4 function to convert the buffer
  ret = to_mp4(input_buffer, input_size, (void **)&output_buffer, &output_size);
  if (ret < 0) {
    fprintf(stderr, "Error converting to MP4\n");
    goto cleanup;
  }

  // Open the output file
  output_file = fopen(output_filename, "wb");
  if (!output_file) {
    perror("Could not open output file");
    ret = -1;
    goto cleanup;
  }

  // Write the output buffer to the file
  if (fwrite(output_buffer, 1, output_size, output_file) != output_size) {
    perror("Could not write output file");
    ret = -1;
    goto cleanup;
  }

cleanup:

  if (output_buffer) {
    av_free(output_buffer);
  }
  if (input_file) {
    fclose(input_file);
  }
  if (output_file) {
    fclose(output_file);
  }

  return ret;
}

// for running it standalone
// gcc ./mp4.c -lavcodec -lswscale -lavformat
int main(const int argc, const char **argv) {

  if (argc != 3) {
    printf("Usage: %s <input_file> <output_file>\n", argv[0]);
    return -1;
  }

  const char *input_filename = argv[1];
  const char *output_filename = argv[2];

  int result = convert_file_to_mp4(input_filename, output_filename);
  if (result == 0) {
    printf("Conversion successful!\n");
  } else {
    printf("Conversion failed!\n");
  }
  return result;
}