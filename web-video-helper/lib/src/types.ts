export interface OnMediaProps {
  doCapture: Function;
}

export interface WebcamProps extends React.HTMLProps<HTMLVideoElement> {
  audio?: boolean;
  audioConstraints?: MediaStreamConstraints["audio"];
  forceScreenshotSourceSize?: boolean;
  imageSmoothing?: boolean;
  mirrored?: boolean;
  minScreenshotHeight?: number;
  minScreenshotWidth?: number;
  onUserMedia?: (props: OnMediaProps) => void;
  onUserMediaError?: (error: string) => void;
  screenshotFormat?: "image/webp" | "image/png" | "image/jpeg";
  screenshotQuality?: number;
  videoConstraints?: MediaStreamConstraints["video"];
}
