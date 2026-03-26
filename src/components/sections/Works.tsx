import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { github } from "../../assets";
import { SectionWrapper } from "../../hoc";
import { fetchProjects } from "../../api/portfolio";
import { fadeIn } from "../../utils/motion";
import { config } from "../../constants/config";
import { Header } from "../atoms/Header";
import { TProject } from "../../types";

const TAG_COLORS = [
  "blue-text-gradient",
  "green-text-gradient",
  "orange-text-gradient",
  "pink-text-gradient",
  "lime-text-gradient",
  "light-blue-text-gradient",
  "aqua-text-gradient",
  "violet-text-gradient",
  "cyan-text-gradient",
];

const ProjectCard: React.FC<{ index: number } & TProject> = ({
  index,
  name,
  description,
  tags,
  image,
  sourceCodeLink,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        glareEnable
        tiltEnable
        tiltMaxAngleX={30}
        tiltMaxAngleY={30}
        glareColor="#aaa6c3"
      >
        <a
          href={sourceCodeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-2xl sm:w-[300px]"
        >
          <div className="card-project w-full cursor-pointer rounded-2xl p-5 transition hover:ring-2 hover:ring-[#915EFF]/50 sm:w-[300px]">
            <div className="relative h-[230px] w-full">
              <img
                src={image}
                alt={name}
                className="h-full w-full rounded-2xl object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="card-img_hover absolute inset-0 m-3 flex justify-end">
                <div className="black-gradient flex h-10 w-10 items-center justify-center rounded-full">
                  <img
                    src={github}
                    alt="github"
                    className="h-1/2 w-1/2 object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-[24px] font-bold text-white">{name}</h3>
              <p className="text-secondary mt-2 text-[14px]">{description}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <p
                  key={tag.name}
                  className={`text-[14px] ${TAG_COLORS[i % TAG_COLORS.length]}`}
                >
                  #{tag.name}
                </p>
              ))}
            </div>
          </div>
        </a>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  const [projects, setProjects] = useState<TProject[]>([]);

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  return (
    <div className="min-h-[200px]">
      <Header useMotion={true} {...config.sections.works} />

      <div className="flex w-full">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="text-secondary mt-3 max-w-3xl text-[17px] leading-[30px]"
        >
          {config.sections.works.content}
        </motion.p>
      </div>

      <div className="mt-20 flex flex-wrap gap-7">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Works, "works");
