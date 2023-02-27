import React from "react";

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      "console-log": { children: string };
    }
  }
}
