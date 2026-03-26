import {
  collection,
  getDocs,
  getDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import type { TProject, TExperience, TTechnology, TService, TProfile, TSocials } from "../types";

const COLLECTIONS = {
  projects: "portfolio_projects",
  experience: "portfolio_experience",
  tech: "portfolio_tech",
  config: "portfolio_config",
  services: "portfolio_services",
  cv: "cv",
} as const;

type PresentationData = { p: string; h2: string; content: string };

const emptyPresentation: PresentationData = { p: "", h2: "", content: "" };

const emptyProfile: TProfile = {
  fullName: "",
  name: "",
  p: ["", ""],
  pageTitle: "",
  email: "",
};

export async function fetchProfile(): Promise<TProfile> {
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.config, "hero"));
    if (snap.exists()) {
      const d = snap.data() as Record<string, unknown>;
      return {
        fullName: typeof d.fullName === "string" ? d.fullName : "",
        name: typeof d.name === "string" ? d.name : "",
        p: Array.isArray(d.p)
          ? [typeof d.p[0] === "string" ? d.p[0] : "", typeof d.p[1] === "string" ? d.p[1] : ""]
          : ["", ""],
        pageTitle: typeof d.pageTitle === "string" ? d.pageTitle : "",
        email: typeof d.email === "string" ? d.email : "",
      };
    }
  } catch {
    // ignore
  }
  return emptyProfile;
}

export async function fetchPresentation(): Promise<PresentationData> {
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.config, "presentation"));
    if (snap.exists()) {
      const d = snap.data() as PresentationData;
      return {
        p: d.p ?? "",
        h2: d.h2 ?? "",
        content: d.content ?? "",
      };
    }
  } catch {
    // ignore
  }
  return emptyPresentation;
}

export async function fetchProjects(): Promise<TProject[]> {
  try {
    const snap = await getDocs(
      query(collection(db, COLLECTIONS.projects), orderBy("name"))
    );
    return snap.docs.map((d) => d.data() as TProject);
  } catch {
    return [];
  }
}

export async function fetchExperiences(): Promise<TExperience[]> {
  try {
    const snap = await getDocs(
      query(collection(db, COLLECTIONS.experience), orderBy("date", "desc"))
    );
    return snap.docs.map((d) => d.data() as TExperience);
  } catch {
    return [];
  }
}

export async function fetchTechnologies(): Promise<TTechnology[]> {
  try {
    const snap = await getDocs(
      query(collection(db, COLLECTIONS.tech), orderBy("name"))
    );
    return snap.docs.map((d) => d.data() as TTechnology);
  } catch {
    return [];
  }
}

export async function fetchServices(): Promise<TService[]> {
  try {
    const snap = await getDocs(
      query(collection(db, COLLECTIONS.services), orderBy("title"))
    );
    return snap.docs.map((d) => d.data() as TService);
  } catch {
    return [];
  }
}

/**
 * Récupère le lien du CV depuis Firestore (collection cv, document cv, champ lien).
 */
export async function fetchCvLink(): Promise<string> {
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.cv, "cv"));
    if (snap.exists()) {
      const d = snap.data() as { lien?: string };
      return typeof d.lien === "string" ? d.lien : "";
    }
  } catch {
    // ignore
  }
  return "";
}

const socialKeys = ["facebook", "linkedin", "twitter", "github"] as const;
const socialIconKeys = ["facebook_icon", "linkedin_icon", "twitter_icon", "github_icon"] as const;

export async function fetchSocials(): Promise<TSocials> {
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.config, "socials"));
    if (snap.exists()) {
      const d = snap.data() as Record<string, unknown>;
      const out: TSocials = {};
      socialKeys.forEach((k) => {
        const v = d[k];
        if (typeof v === "string" && v.trim()) out[k] = v.trim();
      });
      socialIconKeys.forEach((k) => {
        const v = d[k];
        if (typeof v === "string" && v.trim()) out[k] = v.trim();
      });
      return out;
    }
  } catch {
    // ignore
  }
  return {};
}
