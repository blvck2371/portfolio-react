import { useEffect, useState } from "react";
import { BallCanvas } from "../canvas";
import { CanvasErrorFallback } from "../layout/CanvasErrorFallback";
import { SectionWrapper } from "../../hoc";
import { Header } from "../atoms/Header";
import { fetchTechnologies } from "../../api/portfolio";
import { config } from "../../constants/config";
import type { TTechnology } from "../../types";

// Limite de Canvas 3D pour éviter "Too many WebGL contexts" (navigateur ~8–16 max)
const MAX_3D_BALLS = 20;

const Tech = () => {
  const [technologies, setTechnologies] = useState<TTechnology[]>([]);

  useEffect(() => {
    fetchTechnologies().then(setTechnologies);
  }, []);

  const section = config.sections.tech;

  return (
    <>
      <Header useMotion={true} p={section.p} h2={section.h2} />
      <div className="mt-12 flex flex-row flex-wrap justify-center gap-10">
        {technologies.map((technology, index) => (
          <div className="flex flex-col items-center gap-3" key={technology.name}>
            <div className="h-28 w-28 rounded-2xl overflow-hidden bg-primary">
              {technology.icon ? (
                index < MAX_3D_BALLS ? (
                  <CanvasErrorFallback
                    fallback={
                      <div
                        className="h-full w-full rounded-full bg-[#151030] border border-slate-700 flex items-center justify-center"
                        title={technology.name}
                      />
                    }
                  >
                    <BallCanvas icon={technology.icon} />
                  </CanvasErrorFallback>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary p-2">
                    <img
                      src={technology.icon}
                      alt={technology.name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                )
              ) : (
                <div
                  className="h-full w-full rounded-full bg-[#151030] border border-slate-700 flex items-center justify-center"
                  title={technology.name}
                />
              )}
            </div>
            <span className="text-center text-sm font-medium text-white">
              {technology.title ?? technology.name}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "tech");
