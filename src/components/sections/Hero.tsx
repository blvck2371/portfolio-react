import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

import { styles } from "../../constants/styles";
import { fetchCvLink, fetchProfile } from "../../api/portfolio";
import type { TProfile } from "../../types";

const emptyProfile: TProfile = { fullName: "", name: "", p: ["", ""], pageTitle: "", email: "" };

const Hero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [cvLink, setCvLink] = useState("");
  const [profile, setProfile] = useState<TProfile>(emptyProfile);

  useEffect(() => {
    fetchCvLink().then(setCvLink);
  }, []);
  useEffect(() => {
    fetchProfile().then((data) => {
      setProfile(data);
      if (data.pageTitle) document.title = data.pageTitle;
    });
  }, []);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0]);

  return (
    <section ref={sectionRef} className={`relative mx-auto h-screen w-full`}>
      <motion.div
        aria-hidden="true"
        style={{ y: glowY, opacity: glowOpacity }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#915EFF]/20 blur-3xl" />
        <div className="absolute left-[18%] top-[28%] h-[320px] w-[320px] rounded-full bg-[#00cea8]/10 blur-3xl" />
      </motion.div>

      <div
        className={`absolute inset-0 top-[120px] mx-auto max-w-7xl ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className="mt-5 flex flex-col items-center justify-center">
          <div className="h-5 w-5 rounded-full bg-[#915EFF]" />
          <div className="violet-gradient h-40 w-1 sm:h-80" />
        </div>

        <motion.div style={{ y: textY }}>
          {(profile.name || profile.p[0] || profile.p[1]) && (
            <>
              <h1 className={`${styles.heroHeadText} text-white`}>
                {profile.name ? (
                  <>
                    Salut, je suis{" "}
                    <span className="text-[#915EFF]">{profile.name}</span>
                  </>
                ) : null}
              </h1>
              {(profile.p[0] || profile.p[1]) && (
                <p className={`${styles.heroSubText} text-white-100 mt-2`}>
                  {profile.p[0]} <br className="hidden sm:block" />
                  {profile.p[1]}
                </p>
              )}
            </>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-lg bg-[#915EFF] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#7c4ae0]"
            >
              Contactez moi
            </a>
            {cvLink ? (
              <a
                href={cvLink}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="rounded-lg border border-[#915EFF] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#915EFF]/20"
              >
                Télécharger CV
              </a>
            ) : null}
          </div>
        </motion.div>
      </div>

      <div className="xs:bottom-10 absolute bottom-32 flex w-full items-center justify-center">
        <a href="#about">
          <div className="border-secondary flex h-[64px] w-[35px] items-start justify-center rounded-3xl border-4 p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="bg-secondary mb-1 h-3 w-3 rounded-full"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
