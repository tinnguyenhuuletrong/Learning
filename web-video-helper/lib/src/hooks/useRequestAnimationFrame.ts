import * as React from "react";

const useAnimationFrame = (fps: number = 60) => (callback: Function) => {
  const requestRef = React.useRef<number>(0);
  const previousTimeRef = React.useRef<number>();
  const intervalMs = React.useMemo<number>(() => 1000 / fps, [fps]);

  React.useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current) {
        const deltaTime = time - previousTimeRef.current;
        if (deltaTime < intervalMs) {
          // Do nothing
        } else {
          callback(deltaTime);
          previousTimeRef.current = time;
        }
      } else {
        previousTimeRef.current = time;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
};

export default useAnimationFrame;
