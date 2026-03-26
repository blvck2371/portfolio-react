import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { COLLECTIONS, CONFIG_DOCS } from "./firestore-collections";
import type { TProfile } from "../../types";

const emptyProfile: TProfile = {
  fullName: "",
  name: "",
  p: ["", ""],
  pageTitle: "",
  email: "",
};

export function AdminHero() {
  const [fullName, setFullName] = useState("");
  const [name, setName] = useState("");
  const [p0, setP0] = useState("");
  const [p1, setP1] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const ref = doc(db, COLLECTIONS.config, CONFIG_DOCS.hero);

  useEffect(() => {
    getDoc(ref)
      .then((snap) => {
        if (snap.exists()) {
          const d = snap.data() as Record<string, unknown>;
          setFullName(typeof d.fullName === "string" ? d.fullName : "");
          setName(typeof d.name === "string" ? d.name : "");
          const p = Array.isArray(d.p) ? d.p : [];
          setP0(typeof p[0] === "string" ? p[0] : "");
          setP1(typeof p[1] === "string" ? p[1] : "");
          setPageTitle(typeof d.pageTitle === "string" ? d.pageTitle : "");
          setEmail(typeof d.email === "string" ? d.email : "");
        } else {
          setFullName(emptyProfile.fullName);
          setName(emptyProfile.name);
          setP0(emptyProfile.p[0]);
          setP1(emptyProfile.p[1]);
          setPageTitle(emptyProfile.pageTitle);
          setEmail(emptyProfile.email);
        }
      })
      .catch(() => {
        setFullName(emptyProfile.fullName);
        setName(emptyProfile.name);
        setP0(emptyProfile.p[0]);
        setP1(emptyProfile.p[1]);
        setPageTitle(emptyProfile.pageTitle);
        setEmail(emptyProfile.email);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(ref, {
        fullName: fullName.trim(),
        name: name.trim(),
        p: [p0.trim(), p1.trim()],
        pageTitle: pageTitle.trim(),
        email: email.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-400">Chargement…</p>;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-md font-semibold text-white">Profil & Hero</h2>
      <p className="text-xs text-slate-400">
        Ces textes s’affichent en haut du site (Hero) et dans l’onglet du navigateur. S’ils sont vides, le site affiche rien jusqu’à ce que vous les enregistriez ici.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4"
      >
        <div>
          <label className="block text-xs font-medium text-slate-300">Nom complet</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ex: Abdel Raoufou Lindou Ngapout"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">Prénom / nom affiché (Hero)</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Abdel Raoufou (pour « Salut, je suis … »)"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">Sous-titre Hero — ligne 1</label>
          <input
            value={p0}
            onChange={(e) => setP0(e.target.value)}
            placeholder="Ex: Développeur web, mobile (Flutter) et DevOps."
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">Sous-titre Hero — ligne 2</label>
          <input
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            placeholder="Ex: Interfaces modernes et architectures digitales."
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">Titre de la page (onglet navigateur)</label>
          <input
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            placeholder="Ex: Abdel Raoufou Lindou Ngapout — Portfolio 3D"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">Email de contact (formulaire)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: votre@email.com"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#915EFF] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer le profil"}
        </button>
      </form>
    </section>
  );
}
