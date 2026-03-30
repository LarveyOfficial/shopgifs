import { useEffect } from "react";

export const useKeyboardShortcut = (keys: string[], callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        keys.every(
          (key) =>
            (key === "ctrl" && event.ctrlKey) ||
            (key === "shift" && event.shiftKey) ||
            (key === "alt" && event.altKey) ||
            (event.key.toLowerCase() === key)
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
        callback();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys, callback]);
};
