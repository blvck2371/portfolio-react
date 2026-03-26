import React, { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { web, mobile, backend, creator } from "../../assets";
import { SectionWrapper } from "../../hoc";
import { fadeIn } from "../../utils/motion";
import { buildServiceCardsWithIcons } from "../../utils/serviceCards";
import { fetchPresentation, fetchServices } from "../../api/portfolio";
import { Header } from "../atoms/Header";

const DEFAULT_ICON_POOL = [web, mobile, backend, creator];

interface IServiceCard {
  index: number;
  title: string;
  icon: string;
}

const ServiceCard: React.FC<IServiceCard> = ({ index, title, icon }: IServiceCard) => (
  <Tilt
    glareEnable
    tiltEnable
    tiltMaxAngleX={30}
    tiltMaxAngleY={30}
    glareColor="#aaa6c3"
  >
    <div className="max-w-[250px] w-full xs:w-[250px]">
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className="green-pink-gradient shadow-card w-full rounded-[20px] p-[1px]"
      >
        <div className="bg-tertiary flex min-h-[280px] flex-col items-center justify-evenly rounded-[20px] px-12 py-5">
          <img
            src={icon}
            alt="web-development"
            className="h-16 w-16 object-contain"
            loading="lazy"
            decoding="async"
          />

          <h3 className="text-center text-[20px] font-bold text-white">
            {title}
          </h3>
        </div>
      </motion.div>
    </div>
  </Tilt>
);

const emptySection = { p: "", h2: "", content: "" };

const About = () => {
  const [section, setSection] = useState(emptySection);
  const [displayCards, setDisplayCards] = useState<{ title: string; icon: string }[]>([]);

  useEffect(() => {
    fetchPresentation().then((data) =>
      setSection({ ...emptySection, ...data })
    );
  }, []);

  useEffect(() => {
    fetchServices().then((data) =>
      setDisplayCards(buildServiceCardsWithIcons(data, DEFAULT_ICON_POOL))
    );
  }, []);

  return (
    <>
      <Header useMotion={true} {...section} />

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="text-secondary mt-4 max-w-3xl text-[17px] leading-[30px]"
      >
        {section.content}
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10 max-sm:justify-center">
        {displayCards.map((card, index) => (
          <ServiceCard key={`${card.title}-${index}`} index={index} title={card.title} icon={card.icon} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
