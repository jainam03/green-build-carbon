import { useEffect, useCallback } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
  /** If true, shortcut is disabled when user is typing in an input/textarea */
  disableInInputs?: boolean;
}

/**
 * Shneiderman Rule 7: Internal locus of control
 * Nielsen H7: Flexibility and efficiency of use — Accelerators for frequent users
 * 
 * Registers global keyboard shortcuts and returns cleanup automatically.
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrl === (e.ctrlKey || e.metaKey);
        const shiftMatch = !!shortcut.shift === e.shiftKey;
        const altMatch = !!shortcut.alt === e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // Skip if user is in an input and shortcut opts out
          if (shortcut.disableInInputs && isInput) continue;

          e.preventDefault();
          e.stopPropagation();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}

/** 
 * All available shortcut definitions (for the help overlay).
 * Actions are injected at usage site; this is the static registry.
 */
export const SHORTCUT_REGISTRY = [
  { key: "n", ctrl: true, label: "Ctrl + N", description: "New Activity Log" },
  { key: "s", ctrl: true, label: "Ctrl + S", description: "Toggle Simulation" },
  { key: "z", ctrl: true, label: "Ctrl + Z", description: "Undo last change" },
  { key: "z", ctrl: true, shift: true, label: "Ctrl + Shift + Z", description: "Redo last change" },
  { key: "Escape", label: "Esc", description: "Close modal / overlay" },
  { key: "?", label: "?", description: "Show keyboard shortcuts" },
];
