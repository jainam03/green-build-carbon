import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { SHORTCUT_REGISTRY } from "@/hooks/useKeyboardShortcuts";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Nielsen H10: Help and documentation
 * Sleek overlay listing all keyboard shortcuts.
 */
export default function KeyboardShortcutsHelp({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                  <Keyboard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-base">Keyboard Shortcuts</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Power-user accelerators</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shortcut List */}
            <div className="px-6 py-4 space-y-1">
              {SHORTCUT_REGISTRY.map((shortcut, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 px-1 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm text-slate-700 font-medium">{shortcut.description}</span>
                  <kbd className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-mono font-bold text-slate-600 shadow-sm">
                    {shortcut.label}
                  </kbd>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-[11px] text-slate-400 text-center font-medium">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono text-[10px] font-bold mx-0.5">Esc</kbd> to close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
