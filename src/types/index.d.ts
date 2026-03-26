export type TCommonProps = {
  title?: string;
  name?: string;
  icon?: string;
};

export type TExperience = {
  companyName: string;
  iconBg: string;
  date: string;
  points: string[];
  location?: string;
  siret?: string;
} & Required<Omit<TCommonProps, "name">>;

export type TProject = {
  description: string;
  tags: {
    name: string;
    color: string;
  }[];
  image: string;
  sourceCodeLink: string;
} & Required<Pick<TCommonProps, "name">>;

export type TTechnology = Required<Omit<TCommonProps, "title">> & { title?: string };

export type TNavLink = {
  id: string;
} & Required<Pick<TCommonProps, "title">>;

export type TService = Required<Omit<TCommonProps, "name">>;

/** Statut d'une certification pour l'affichage sur les cartes */
export type TCertificationStatus = "à faire" | "en cours" | "terminé";

export type TCertification = {
  name: string;
  issuer: string;
  date: string;
  /** Lien vers une page web (si pas de PDF) */
  url?: string;
  /** URL du PDF stocké dans Firebase Storage (prioritaire au clic) */
  pdfUrl?: string;
  image?: string;
  /** Statut affiché sur la carte : à faire, en cours, terminé */
  status?: TCertificationStatus;
  /** Tags affichés sur la carte (comme les projets) */
  tags?: { name: string; color: string }[];
};

/** Données du profil / Hero : nom, salut, sous-titre, titre de la page (éditables par l’admin). */
export type TProfile = {
  fullName: string;
  /** Nom affiché dans le Hero (ex. "Abdel Raoufou") */
  name: string;
  /** Lignes du sous-titre (ex. "Développeur web, mobile (Flutter) et DevOps.") */
  p: [string, string];
  /** Titre de l’onglet (ex. "Abdel Raoufou Lindou Ngapout — Portfolio 3D") */
  pageTitle: string;
  email: string;
};

/** Réseaux sociaux (optionnels) : l’admin remplit les liens et peut optionnellement mettre une URL d’icône. */
export type TSocials = {
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook_icon?: string;
  linkedin_icon?: string;
  twitter_icon?: string;
  github_icon?: string;
};

export type TMotion = {
  direction: "up" | "down" | "left" | "right" | "";
  type: "tween" | "spring" | "just" | "";
  delay: number;
  duration: number;
};
