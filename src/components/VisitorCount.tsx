import { useEffect, useRef, useState } from "react";
import {
  subscribeVisitorsCount,
  incrementVisitorOnce,
} from "../api/visitors";
import { LoginModal } from "./LoginModal";

const TRIPLE_CLICK_MS = 500;

export function VisitorCount() {
  const [count, setCount] = useState<number>(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeVisitorsCount(setCount);
    incrementVisitorOnce();
    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);
    if (clicks.current >= 3) {
      clicks.current = 0;
      setLoginOpen(true);
      return;
    }
    timer.current = setTimeout(() => {
      clicks.current = 0;
      timer.current = null;
    }, TRIPLE_CLICK_MS);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="flex cursor-pointer items-center gap-1.5 text-secondary transition hover:text-white"
        title="Visiteurs"
      >
        <span className="text-[12px] md:text-[14px]">
          <span className="font-semibold text-white">
            {count.toLocaleString("fr-FR")}
          </span>
          <span className="ml-1">visiteurs</span>
        </span>
      </button>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
