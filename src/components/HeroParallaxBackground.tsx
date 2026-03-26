import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Fond du Hero avec effet parallax au scroll : l’image bouge plus lentement
 * que le contenu pour un rendu fluide et agréable.
 */
export function HeroParallaxBackground() {
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, (v) => -v * 0.3);

  return (
    <motion.div
      aria-hidden="true"
      style={{ y }}
      className="pointer-events-none absolute inset-0 -top-[15%] z-0 h-[130%] w-full bg-hero-pattern bg-cover bg-center bg-no-repeat"
    />
  );
}
