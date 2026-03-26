import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const MIN_LOADING_MS = 2200;
const FADE_OUT_MS = 500;

export function AppLoader({ onReady }: { onReady: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let mounted = true;
    const start = Date.now();

    const tryFinish = () => {
      if (!mounted) return;
      const elapsed = Date.now() - start;
      if (elapsed >= MIN_LOADING_MS) {
        setVisible(false);
        setTimeout(() => {
          if (mounted) onReady();
        }, FADE_OUT_MS);
      }
    };

    tryFinish();
    const t = setTimeout(tryFinish, MIN_LOADING_MS);

    const onLoad = () => {
      if (document.readyState === "complete") tryFinish();
    };
    window.addEventListener("load", onLoad);

    return () => {
      mounted = false;
      clearTimeout(t);
      window.removeEventListener("load", onLoad);
    };
  }, [onReady]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT_MS / 1000 }}
        >
          <div className="flex flex-col items-center gap-8">
            <div className="h-14 w-14 rounded-full border-4 border-[#915EFF]/40 border-t-[#915EFF] animate-spin" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">Chargement du portfolio…</p>
            </div>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className="h-full rounded-full bg-[#915EFF]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: MIN_LOADING_MS / 1000, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
