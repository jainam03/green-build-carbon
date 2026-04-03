import { useState, useCallback, useRef } from "react";

/**
 * Shneiderman Rule 3: Support reversal of actions
 * Shneiderman Rule 6: Easy reversal
 * 
 * Generic undo/redo hook that maintains a history stack.
 * Supports Ctrl+Z (undo) and Ctrl+Shift+Z (redo) via useKeyboardShortcuts.
 */
export function useUndoRedo<T>(initialState: T, maxHistory = 30) {
  const [state, setState] = useState<T>(initialState);
  const historyRef = useRef<T[]>([initialState]);
  const indexRef = useRef(0);

  const set = useCallback((newState: T) => {
    // Trim any future history if we're not at the end
    const newHistory = historyRef.current.slice(0, indexRef.current + 1);
    newHistory.push(newState);

    // Keep history bounded
    if (newHistory.length > maxHistory) {
      newHistory.shift();
    } else {
      indexRef.current++;
    }

    historyRef.current = newHistory;
    setState(newState);
  }, [maxHistory]);

  const undo = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current--;
      const prevState = historyRef.current[indexRef.current];
      setState(prevState);
      return prevState;
    }
    return state;
  }, [state]);

  const redo = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current++;
      const nextState = historyRef.current[indexRef.current];
      setState(nextState);
      return nextState;
    }
    return state;
  }, [state]);

  const canUndo = indexRef.current > 0;
  const canRedo = indexRef.current < historyRef.current.length - 1;

  // Reset history (e.g., on fresh data load from Firestore)
  const resetHistory = useCallback((freshState: T) => {
    historyRef.current = [freshState];
    indexRef.current = 0;
    setState(freshState);
  }, []);

  return { state, set, undo, redo, canUndo, canRedo, resetHistory };
}
