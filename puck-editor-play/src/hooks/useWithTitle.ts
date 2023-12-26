import { useEffect } from "react";

export function useWithTitle(title: string) {
  useEffect(() => {
    document.title = title;
  });
}
