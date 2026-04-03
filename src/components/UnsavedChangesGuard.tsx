import { useEffect } from "react";

interface Props {
  hasUnsavedChanges: boolean;
  message?: string;
}

/**
 * Nielsen H5: Error prevention
 * Warns users before accidentally navigating away with unsaved changes.
 * Uses the native `beforeunload` browser API.
 */
export default function UnsavedChangesGuard({
  hasUnsavedChanges,
  message = "You have unsaved changes. Are you sure you want to leave?",
}: Props) {
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges, message]);

  return null; // This is a behavioral component, no DOM output
}
