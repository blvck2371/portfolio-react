type TSection = {
  p: string;
  h2: string;
  content?: string;
};

type TConfig = {
  html: {
    title: string;
    fullName: string;
    email: string;
  };
  hero: {
    name: string;
    p: string[];
    /** Lien Firebase Storage du CV PDF (téléchargement). */
    cvDownloadUrl: string;
  };
  contact: {
    form: {
      name: {
        span: string;
        placeholder: string;
      };
      email: {
        span: string;
        placeholder: string;
      };
      message: {
        span: string;
        placeholder: string;
      };
    };
  } & TSection;
  sections: {
    about: Required<TSection>;
    experience: TSection;
    feedbacks: TSection;
    works: Required<TSection>;
    tech: TSection;
    certifications: TSection;
  };
};

export const config: TConfig = {
  html: {
    title: "",
    fullName: "",
    email: "",
  },
  hero: {
    name: "",
    p: ["", ""],
    cvDownloadUrl: "",
  },
  contact: {
    p: "Entrons en contact",
    h2: "Contact.",
    form: {
      name: {
        span: "Votre nom",
        placeholder: "Comment puis-je vous appeler ?",
      },
      email: {
        span: "Votre email",
        placeholder: "Où puis-je vous répondre ?",
      },
      message: {
        span: "Votre message",
        placeholder: "Parlez-moi de votre projet, besoin ou idée...",
      },
    },
  },
  sections: {
    about: {
      p: "À propos",
      h2: "Présentation.",
      content: `Je suis développeur web, mobile (Flutter) et DevOps, expert architecte digital, avec un parcours en
      licence puis master orienté vers la conception et la mise en œuvre
      d’applications web complètes. Je travaille avec React, Flutter, Node.js,
      TypeScript et les services cloud pour créer des solutions claires,
      performantes et maintenables, et le déploiement (CI/CD, DevOps). l’expérience
      utilisateur.`,
    },
    experience: {
      p: "Parcours & expériences",
      h2: "Expériences.",
    },
    feedbacks: {
      p: "Ce que l’on dit de moi",
      h2: "Témoignages.",
    },
    works: {
      p: "Mes réalisations",
      h2: "Projets.",
      content: `Les projets présentés ici résument mon savoir‑faire : analyse du
    besoin, conception de l’architecture, développement front et back,
    jusqu’au déploiement. Chaque projet met en avant des choix techniques
    réfléchis et une attention particulière à la clarté et à l’expérience
    utilisateur.`,
    },
    tech: {
      p: "Compétences techniques",
      h2: "Technologies.",
    },
    certifications: {
      p: "Formations & certifications",
      h2: "Certifications.",
    },
  },
};
